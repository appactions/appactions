import { source } from 'common-tags';
const yaml = require('yaml');

function getLastPatternFromWith(withObject) {
    if (typeof withObject === 'string') {
        return withObject;
    }
    if (typeof withObject === 'object' && withObject !== null) {
        const patterns = Object.keys(withObject);
        return patterns[patterns.length - 1];
    }
    throw new Error('Invalid `with` type');
}

function createChainFromStep(step) {
    const commands = ['cy'];

    if (step.with) {
        if (typeof step.with === 'string') {
            commands.push(`with('${step.with}')`);
        } else if (typeof step.with === 'object' && step.with !== null) {
            Object.entries(step.with).forEach(([key, value]) => {
                if (typeof value === 'string') {
                    if (value.startsWith('/') && value.endsWith('/')) {
                        commands.push(`with('${key}', ${value})`);
                    } else {
                        commands.push(`with('${key}', '${value}')`);
                    }
                } else if (!value) {
                    commands.push(`with('${key}')`);
                } else {
                    throw new Error('Invalid `with` type');
                }
            });
        } else {
            throw new Error('Invalid `with` type');
        }
    }

    if (step.do) {
        // debugger;
        // const firstDoKey = Object.keys(step.do)[0];
        // const firstDoArgs = JSON.stringify(step.do[firstDoKey]);
        // commands.push(`do('${step.with}', '${firstDoKey}', ${firstDoArgs})`);

        if (typeof step.do === 'string') {
            commands.push(`do('${getLastPatternFromWith(step.with)}', '${step.do}')`);
        } else if (typeof step.do === 'object' && step.do !== null) {
            Object.entries(step.do).forEach(([key, value]) => {
                const values = Array.isArray(value) ? value : [value];
                commands.push(`do('${getLastPatternFromWith(step.with)}', '${key}', [${values.map(v => typeof v === 'string' ? `'${v}'` : v).join(', ')}])`);
            });
        } else {
            throw new Error('Invalid `do` type');
        }
    }

    return commands.join('\n\t.').concat(';\n');
}

export const preprocessFlows = (content, { fileName }) => {
    const flow = yaml.parse(content);

    return source`
        describe('${fileName}', () => {
            it('${flow.description}', () => {
                cy.visit('${flow.start.route}');
                ${flow.steps.map(createChainFromStep).join('\n')}
            });
        });
    `;
};
