import isEqual from 'lodash.isequal';
import json2yaml from './json-to-yaml';

export default function renderYAML({ agent, meta, recordings }) {
    if (recordings.length === 0) {
        return '# empty test';
    }

    const steps = convertRecordingsToFlow(agent, recordings);

    const result = {
        description: meta.description,
        start: {
            route: meta.start.route,
            auth: meta.start.auth,
        },
        steps: steps.map(renderStep),
    };

    return json2yaml(result);
}

function getOwner({ name, pattern }) {
    return name ? { [pattern]: name } : pattern;
}

function renderStep(step) {
    const result = {
        with: step.owners.length === 1 ? getOwner(step.owners[0]) : step.owners.map(getOwner),
    };

    // "do" is not a valid identifier in js :(
    const interaction = getDo(step);
    if (interaction) {
        result.do = interaction;
    }

    return result;
}

function getDo(step) {
    return step.payload.map(({ type, action, args, value }) => {
        if (type === 'assert') {
            if (!value && args.length === 0) {
                return { assert: action };
            }
            return { assert: { action: args.length ? { [action]: args } : action, value } };
        }

        return { [action]: args };
    });
}

const mergeEvents = {
    type: (prev, curr) => {
        return [
            {
                ...curr,
                args: [prev.args[0] + curr.args[0]],
            },
        ];
    },
};

export function merger([prev, curr]) {
    if (isEqual(prev.owners, curr.owners)) {
        let payload = [...prev.payload, ...curr.payload];

        const lastPayload = payload[payload.length - 1];
        const lastButOnePayload = payload[payload.length - 2];

        if (mergeEvents[lastPayload.action] && lastButOnePayload.action === lastPayload.action) {
            const mergedPayload = mergeEvents[lastPayload.action](lastButOnePayload, lastPayload);
            payload = [...payload.slice(0, -2), ...mergedPayload];
        }

        return [
            {
                owners: curr.owners,
                payload,
            },
        ];
    }

    return [prev, curr];
}

function convertRecordingsToFlow(agent, recordings) {
    return recordings.reduce((flow, currentRecording, index) => {
        let result = [...flow, currentRecording];

        if (currentRecording.nestingEnd) {
            let nestingStartIndex = result.length - 1;
            for (; nestingStartIndex >= 0; nestingStartIndex--) {
                if (
                    result[nestingStartIndex].nestingStart &&
                    result[nestingStartIndex].depth === currentRecording.depth
                ) {
                    break;
                }
            }

            const nesting = handleNesting(agent, result.slice(nestingStartIndex, index + 1));

            result = [...flow.slice(0, nestingStartIndex), ...nesting];
        }

        if (result.length > 1) {
            const newItems = merger([result[result.length - 2], result[result.length - 1]]);
            result = [...result.slice(0, -2), ...newItems];
        }

        return result;
    }, []);
}

export function handleNestingStart(agent, recording) {
    console.log('handleNestingStart');
    return {
        ...recording,
        depth: ++agent._sessionRecordingNestingDepth,
        nestingStart: true,
    };
}

export function handleNestingEnd(agent, recording, simplify, owners) {
    console.log('handleNestingEnd', simplify, owners);
    return {
        ...recording,
        owners,
        depth: agent._sessionRecordingNestingDepth--,
        nestingEnd: true,
        simplify,
    };
}

function handleNesting(agent, collection) {
    const nestingEnd = collection[collection.length - 1];
    const { pattern, action } = nestingEnd.simplify;
    const simplify = agent.getSimplifyForPattern(pattern);

    try {
        const args = simplify[action].collect(new Generator(collection));

        const recording = {
            ...nestingEnd,

            payload: [{ action, args }],
        };

        return [recording];
    } catch (error) {
        console.error('Nesting failed:', error);
        console.log('collection', collection);
    }

    // nesting failed, we return the original collection
    return collection;
}

class Generator {
    constructor(collection) {
        this.collection = collection;
        this.index = 0;
    }

    query = ({ pattern, action, name, optional = false }) => {
        const matches = this.collection
            .flatMap(recording => {
                return recording.payload.map(step => ({
                    ...step,
                    owners: recording.owners,
                }));
            })
            .filter(recording => {
                const currentElement = recording.owners[recording.owners.length - 1];

                if (name && name !== currentElement.name) {
                    return false;
                }

                if (pattern && pattern !== currentElement.pattern) {
                    return false;
                }

                if (action && action !== recording.action) {
                    return false;
                }

                return true;
            });

        if (matches.length === 0) {
            if (optional) {
                return [];
            } else {
                throw new Error(`No matching recording found for ${pattern} ${action} ${name}`);
            }
        }

        if (matches.length > 1) {
            throw new Error(`Multiple matches found for ${pattern} ${action} ${name}`);
        }

        return matches[0].args;
    };
}
