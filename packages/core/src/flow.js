import { source } from 'common-tags';
import yaml from 'yaml';
import { builtInTesters } from './built-in-actions';

export const preprocessFlows = (content, { fileName }) => {
    const flow = yaml.parse(content);

    return source`
describe('${fileName}', () => {
  it('${flow.description}', () => {
    cy.visit('${flow.start.route}');

    ${flow.steps
        .map(step => {
            const chain = new Chain();

            if (step.with) {
                chain.addWith(step.with);
            }

            if (step.do) {
                chain.addDo(step.do);
            }

            if (step.assert) {
                chain.addAssert(step.assert);
            }

            return chain.toString();
        })
        .join('\n\n')}
  });
});
`;
};

class Chain {
    constructor() {
        this._nodes = [];
        this._lastPattern = null;
    }

    addNode = data => {
        this._nodes.push(data);
        return this;
    };

    getLastPattern = () => {
        // return this._lastPattern;
        return 'TODO';
    };

    addWith = withValue => {
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
        if (typeof doValue === 'string') {
            return this.addNode({
                command: 'do',
                args: [doValue],
            });
        } else if (typeof doValue === 'object' && doValue !== null) {
            Object.entries(doValue).forEach(([action, args], index, array) => {
                const lastPattern = this.getLastPattern();
                return this.addNode({
                    command: 'do',
                    args: args ? [lastPattern, action, args] : [lastPattern, action],
                });
            });
            return this;
        }

        throw new Error('Invalid `do` type');
    };

    addAssert = assertValue => {
        // TODO: use builtInTesters to map correct cypress parameters

        if (typeof assertValue === 'string') {
            return this.addNode({
                command: 'should',
                args: [assertValue],
            });
        } else if (typeof assertValue === 'object' && assertValue !== null) {
            Object.entries(assertValue).forEach(([assert, args]) => {
                return this.addNode({
                    command: 'should',
                    args: args ? [assert, args] : [assert],
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
        return ['cy', ...this._nodes.map(this.renderNode)].join('\n\t');
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
        console.log(value);
        throw new Error('Invalid identifier type');
    }
}
