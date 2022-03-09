import { source } from 'common-tags';
const yaml = require('yaml');

function createChainFromStep(step) {
    const commands = ['cy'];

    if (step.with) {
        if (typeof step.with === 'string') {
            commands.push(`with('${step.with}')`);
        } else if (typeof step.with === 'object' && step.with !== null) {
            Object.entries(step.with).forEach(([key, value]) => {
                commands.push(`with('${key}', '${value}')`);
            });
        } else {
            throw new Error('Invalid `with` type');
        }
    }

    if (step.do) {
        const firstDoKey = Object.keys(step.do)[0];
        const firstDoArgs = JSON.stringify(step.do[firstDoKey]);
        commands.push(`do('${step.with}', '${firstDoKey}', ${firstDoArgs})`);
    }

    return commands.join('.').concat(';\n');
}

const preprocessFlows = (content, { fileName }) => {
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

export default preprocessFlows;
