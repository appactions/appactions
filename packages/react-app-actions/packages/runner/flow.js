import { promises as fs } from 'fs';
import path from 'path';
import yaml from 'yaml';
import glob from 'glob';

export async function read() {
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
        flowFiles.map(async fileName => ({
            fileName,
            content: await fs.readFile(fileName, 'utf8'),
        })),
    );
}

export function parse({ content, fileName = 'Unnamed' }) {
    const yamlContent = yaml.parse(content, { mapAsMap: true });
    return { content: yamlContent, fileName };
}

export function resolve({ content, fileName = 'Unnamed' }) {
    const result = Array.from(content.entries()).map(([key, value]) => {
        switch (key) {
            case 'description':
                return [key, value];
            case 'variants':
                return [key, value];
            case 'usage':
                return [key, value];
            case 'data':
                const dataValue = Array.from(value.entries()).map(([key, value]) => {
                    if (typeof key === 'string') {
                        return {
                            namedExports: null,
                            default: key,
                            file: value,
                        };
                    } else if (typeof key === 'object') {
                        return {
                            namedExports: Object.keys(key),
                            default: null,
                            file: value,
                        };
                    } else {
                        throw new Error('Error parsing "data"');
                    }
                });
                return [key, dataValue];
            case 'start':
                return [key, Object.fromEntries(value)];
            case 'flattenedSteps':
                const stepsValue = Object.entries(value).map(([variantName, value]) => {
                    const newValue = value
                        .map(step =>
                            Array.from(step.entries()).map(([key, value]) => {
                                switch (key) {
                                    case 'with':
                                        if (typeof value === 'string') {
                                            return [key, { role: value, specifier: null }];
                                        } else if (value instanceof Map) {
                                            const withValue = Array.from(value.entries());

                                            if (withValue.length !== 1) {
                                                throw new Error('Invalid shape for "with" value in step');
                                            }

                                            return [key, { role: withValue[0][0], specifier: withValue[0][1] }];
                                        }

                                        throw new Error('Invalid value for "with" key in step');

                                    case 'do':
                                        if (typeof value === 'string') {
                                            return [key, { method: value, specifier: null }];
                                        } else if (value instanceof Map) {
                                            const doValue = Array.from(value.entries());

                                            if (doValue.length !== 1) {
                                                throw new Error('Invalid shape for "do" value in step');
                                            }

                                            return [key, { method: doValue[0][0], args: doValue[0][1] }];
                                        }

                                        throw new Error('Invalid value for "with" key in step');

                                    case 'assert':
                                        return [key, value];

                                    default:
                                        throw new Error(`Unknow key in step: "${key}"`);
                                }
                            }),
                        )
                        .map(entries => Object.fromEntries(entries));
                    return [variantName, newValue];
                });

                return ['steps', Object.fromEntries(stepsValue)];

            default:
                throw new Error(`Unknown key in flow file: "${key}"`);
        }
    });

    if (!content.get('name')) {
        result.push(['name', path.basename(fileName).replace(/\.yml$/, '')]);
    }
    return { fileName, content: Object.fromEntries(result) };
}

export function validate({ fileName, content }) {
    return !!content;
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

export function flatten({ fileName, content }) {
    const newFlow = new Map(content);

    const flattenedSteps = content
        .get('variants')
        .map(variant => ({
            variant,
            steps: getStepsForVariant(variant, content.get('steps')),
        }))
        .reduce((acc, { variant, steps }) => ({ ...acc, [variant]: steps }), {});

    newFlow.set('flattenedSteps', flattenedSteps);
    newFlow.delete('steps');

    return { fileName, content: newFlow };
}
