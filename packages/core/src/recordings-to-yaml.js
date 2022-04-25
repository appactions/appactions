import json2yaml from './json-to-yaml';

export default function renderYAML(meta, steps) {
    if (steps.length === 0) {
        return '# empty test';
    }

    const result = {
        description: meta.description,
        start: {
            route: meta.start.route,
            auth: meta.start.auth,
        },
        steps: steps.map(event => {
            if (event.action === 'assert') {
                return renderAssertStep(event);
            }

            return renderEventStep(event);
        }),
    };

    return json2yaml(result);
}

function getOwner({ name, pattern }) {
    return name ? { [pattern]: name } : pattern;
}

function renderEventStep(step) {
    return {
        with: step.owners.length === 1 ? getOwner(step.owners[0]) : step.owners.map(getOwner),
        do: step.args.length === 0 ? step.action : { [step.action]: step.args },
    };
}

// const assert = {
//     action: 'assert',
//     id,
//     owners,
//     asserter,
//     value,
// };
function renderAssertStep(step) {
    return {
        with: step.owners.length === 1 ? getOwner(step.owners[0]) : step.owners.map(getOwner),
        assert: ['this', step.asserter, step.value],
    };
}
