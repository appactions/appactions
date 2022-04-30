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
        steps: steps.map(step => {
            if (step.type === 'assert') {
                return renderAssertStep(step);
            }

            return renderEventStep(step);
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

function renderAssertStep(step) {
    return {
        with: step.owners.length === 1 ? getOwner(step.owners[0]) : step.owners.map(getOwner),
        assert: getAssert(step),
    };
}

function getAssert(step) {
    const asserts = Object.entries(step.assert);

    if (asserts.length === 1 && !asserts[0][1].test && !asserts[0][1].value) {
        return asserts[0][0];
    }

    return asserts.reduce((acc, [action, { test, value }]) => {
        return {
            ...acc,
            [action]: !test && !value ? true : [test, value],
        };
    }, {});
}
