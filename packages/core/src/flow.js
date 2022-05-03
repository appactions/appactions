import { source } from 'common-tags';
import yaml from 'yaml';
import { builtInTesters } from './built-in-actions';

export const preprocessFlows = (content, { fileName }) => {
    const flow = yaml.parse(content);

    if (!fileName) {
        throw new Error('fileName is required');
    }

    if (!flow.steps) {
        throw new Error(`Flow file ${fileName} does not contain steps`);
    }

    return source`
describe('${fileName}', () => {
  it('${flow.description}', () => {
    cy.visit('${flow.start.route}');

    ${flow.steps
        .map((step, index) => {
            const subjectVar = `subject${index + 1}`;

            const subject = new Chain(`const ${subjectVar} = cy`).addWith(step.with);

            const interaction = new Chain(subjectVar, subject).addDo(step.do);
            const asserts = new Chain(subjectVar, subject).addAssert(step.assert);

            return `${subject}\n${interaction}\n${asserts}\n`;
        })
        .join('\n')}
  });
});
`;
};

class Chain {
    constructor(head = 'cy', parentChain) {
        this._head = head;
        this._parentChain = parentChain;
        this._lastPattern = null;
        this._nodes = [];
    }

    getLastPatternFromWith = () => {
        if (this._parentChain && this._parentChain._lastPattern) {
            return this._parentChain._lastPattern;
        }

        if (this._lastPattern) {
            return this._lastPattern;
        }

        throw new Error('No "with" node found');
    };

    addWith = withValue => {
        if (!withValue) {
            return this;
        }

        if (Array.isArray(withValue)) {
            withValue.forEach(value => {
                this.addWith(value);
            });

            return this;
        } else if (typeof withValue === 'string') {
            this._nodes.push({
                command: 'with',
                args: [withValue],
            });
            this._lastPattern = withValue;

            return this;
        } else if (typeof withValue === 'object' && withValue !== null) {
            const [[pattern, name]] = Object.entries(withValue);

            this._nodes.push({
                command: 'with',
                args: [pattern, name],
            });
            this._lastPattern = pattern;

            return this;
        }

        throw new Error('Invalid `with` type');
    };

    addDo = doValue => {
        if (!doValue) {
            return this;
        }

        if (typeof doValue === 'string') {
            this._nodes.push({
                command: 'do',
                args: [doValue],
            });
            return this;
        } else if (typeof doValue === 'object' && doValue !== null) {
            Object.entries(doValue).forEach(([action, args]) => {
                const lastPattern = this.getLastPatternFromWith();
                this._nodes.push({
                    command: 'do',
                    args: args ? [lastPattern, action, args] : [lastPattern, action],
                });
            });
            return this;
        }

        throw new Error('Invalid `do` type');
    };

    addAssert = assertValue => {
        if (!assertValue) {
            return this;
        }

        if (typeof assertValue === 'string') {
            this.createAssertChain(assertValue).forEach(node => {
                this._nodes.push(node);
            });
            return this;
        } else if (typeof assertValue === 'object' && assertValue !== null) {
            Object.entries(assertValue).forEach(([assert, args]) => {
                this.createAssertChain(assert, args).forEach(node => {
                    this._nodes.push(node);
                });
            });
            return this;
        }

        throw new Error('Invalid `assert` type');
    };

    createAssertChain = (action, _args = []) => {
        const [test, value] = Array.isArray(_args) ? _args : [null, _args];

        if (!test) {
            return [
                {
                    command: 'should',
                    args: [action],
                    needsOriginalSubject: true,
                },
            ];
        }

        const tester = builtInTesters[test];

        if (!tester) {
            throw new Error(`Unrecognized test "${test}".`);
        }

        const lastPattern = this.getLastPatternFromWith();

        return [
            {
                command: 'do',
                args: [lastPattern, action, ['TODO']],
                needsOriginalSubject: true,
            },
            {
                command: 'should',
                args: [tester, value],
            },
        ];
    };

    renderNode = (node, index, array) => {
        const last = !array[index + 1] || array[index + 1].needsOriginalSubject;
        const command = `  .${node.command}(${node.args.map(Identifier).join(', ')})`;
        return last ? `${command};` : command;
    };

    toString = () => {
        return this._nodes
            .reduce((acc, node, index, array) => {
                if (index === 0 || node.needsOriginalSubject) {
                    acc.push(this._head);
                }
                acc.push(this.renderNode(node, index, array));
                return acc;
            }, [])
            .join('\n');
    };
}

function Identifier(value) {
    if (typeof value === 'string') {
        return `'${value}'`;
    } else if (typeof value === 'number') {
        return value;
    } else if (typeof value === 'boolean') {
        return value;
    } else if (value === null) {
        return 'null';
    } else if (Array.isArray(value)) {
        return `[${value.map(Identifier).join(', ')}]`;
    } else if (typeof value === 'object' && value !== null) {
        return `{ ${Object.entries(value)
            .map(([key, value]) => `${key}: ${Identifier(value)}`)
            .join(', ')} }`;
    } else {
        throw new Error('Invalid identifier type');
    }
}
