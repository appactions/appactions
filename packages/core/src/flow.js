import { source } from 'common-tags';
import yaml from 'yaml';
import { createAssertChain } from './built-in-actions';

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
        this._nodes = [];
    }

    addNode = data => {
        this._nodes.push(data);
        return this;
    };

    getLastPattern = () => {
        for (let i = this._nodes.length - 1; i >= 0; i--) {
            const node = this._nodes[i];

            if (node.command === 'with') {
                // returns the pattern
                return node.args[0];
            }
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
            return this.addNode({
                command: 'with',
                args: [withValue],
            });
        } else if (typeof withValue === 'object' && withValue !== null) {
            const [[pattern, name]] = Object.entries(withValue);

            return this.addNode({
                command: 'with',
                args: [pattern, name],
            });
        }

        throw new Error('Invalid `with` type');
    };

    addDo = doValue => {
        if (!doValue) {
            return this;
        }

        if (typeof doValue === 'string') {
            return this.addNode({
                command: 'do',
                args: [doValue],
            });
        } else if (typeof doValue === 'object' && doValue !== null) {
            Object.entries(doValue).forEach(([action, args], index, array) => {
                const lastPattern = this.getLastPattern();
                this.addNode({
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
            createAssertChain(assertValue).forEach(node => {
                this.addNode(node);
            });
            return this;
        } else if (typeof assertValue === 'object' && assertValue !== null) {
            Object.entries(assertValue).forEach(([assert, args]) => {
                createAssertChain(assert, args).forEach(node => {
                    this.addNode(node);
                });
            });
            return this;
        }

        throw new Error('Invalid `assert` type');
    };

    renderNode = (node, index, { length }) => {
        const last = index === length - 1;
        const command = `.${node.command}(${node.args.map(Identifier).join(', ')})`;
        return last ? `${command};` : command;
    };

    toString = () => {
        return ['cy', ...this._nodes.map(this.renderNode)].join('\n  ');
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
