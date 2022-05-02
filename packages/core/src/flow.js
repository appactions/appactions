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
        .map(step => new Chain().addWith(step.with).addDo(step.do).addAssert(step.assert).toString())
        .join('\n\n')}
  });
});
`;
};

class Chain {
    constructor() {
        this._withNodes = [];
        this._doNodes = [];
        this._assertNodes = [];
        this._needsSubjectReference = false;
    }

    getLastPattern = () => {
        if (!this._withNodes.length) {
            throw new Error('No "with" node found');
        }

        // returns the last pattern
        return this._withNodes[this._withNodes.length - 1].args[0];
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
            this._withNodes.push({
                command: 'with',
                args: [withValue],
            });

            return this;
        } else if (typeof withValue === 'object' && withValue !== null) {
            const [[pattern, name]] = Object.entries(withValue);

            this._withNodes.push({
                command: 'with',
                args: [pattern, name],
            });

            return this;
        }

        throw new Error('Invalid `with` type');
    };

    addDo = doValue => {
        if (!doValue) {
            return this;
        }

        if (typeof doValue === 'string') {
            this._doNodes.push({
                command: 'do',
                args: [doValue],
            });
            return this;
        } else if (typeof doValue === 'object' && doValue !== null) {
            Object.entries(doValue).forEach(([action, args]) => {
                const lastPattern = this.getLastPattern();
                this._doNodes.push({
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
                this._assertNodes.push(node);
            });
            return this;
        } else if (typeof assertValue === 'object' && assertValue !== null) {
            Object.entries(assertValue).forEach(([assert, args]) => {
                this.createAssertChain(assert, args).forEach(node => {
                    this._assertNodes.push(node);
                });
            });
            return this;
        }

        throw new Error('Invalid `assert` type');
    };

    createAssertChain = (action, _args = []) => {
        const args = Array.isArray(_args) ? _args : [null, _args];
        const [test, value] = args;

        if (!test) {
            return [
                {
                    command: 'should',
                    args: [action],
                    subjectIsWith: true,
                },
            ];
        }

        const tester = builtInTesters[test];

        if (!tester) {
            throw new Error(`Unrecognized test "${test}".`);
        }

        const lastPattern = this.getLastPattern();

        return [
            {
                command: 'do',
                args: [lastPattern, action, ['TODO']],
                subjectIsWith: true,
            },
            {
                command: 'should',
                args: [tester, value],
            },
        ];
    };

    renderNode = (node, index, { length }) => {
        const last = index === length - 1;
        const command = `.${node.command}(${node.args.map(Identifier).join(', ')})`;
        return last ? `${command};` : command;
    };

    toString = () => {
        const nodes = [...this._withNodes, ...this._doNodes, ...this._assertNodes];
        return ['cy', ...nodes.map(this.renderNode)].join('\n  ');
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
