const fs = require('fs').promises;
const path = require('path');
const yaml = require('yaml');
const glob = require('glob');

async function read() {
    const flowFiles = await new Promise((resolve, reject) => {
        glob('flows/*.yml', (error, files) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(files);
        });
    });

    return Promise.all(
        flowFiles.map(async file => {
            const flowYaml = await fs.readFile(file, 'utf8');
            const parsed = yaml.parse(flowYaml, { mapAsMap: true });

            if (parsed) {
                parsed.set('fileName', file);
            }

            return parsed;
        }),
    );
}

function validate(flow) {
    return !!flow;
}

function getStepsForVariant(variant, steps) {
    const result = [];
    for (let i = 0; i < steps.length; i++) {
        if (steps[i].has('switch')) {
            steps[i].forEach((value, key) => {
                if (key instanceof Map && key.get('variant') === variant) {
                    const nestedSteps = getStepsForVariant(variant, value);
                    result.push(...nestedSteps);
                }
            });
        } else {
            result.push(steps[i]);
        }
    }

    return result;
}

function flatten(flow) {
    const newFlow = new Map(flow);

    const flattenedSteps = flow
        .get('variants')
        .map(variant => ({
            variant,
            steps: getStepsForVariant(variant, flow.get('steps')),
        }))
        .reduce((acc, { variant, steps }) => ({ ...acc, [variant]: steps }), {});

    newFlow.set('flattenedSteps', flattenedSteps);

    return newFlow;
}

function resolve(flow) {
    if (!flow.has('name')) {
        const flowName = path.basename(flow.get('fileName')).replace(/\.yml$/, '');
        flow.set('name', flowName);
    }

    return flow;
}

async function run() {
    const flows = await read().then(flows => flows.filter(validate).map(flatten).map(resolve));
    console.log(flows);
}

module.exports.run = run;
