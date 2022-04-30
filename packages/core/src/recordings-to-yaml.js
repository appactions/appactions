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

    const assert = getAssert(step);
    if (assert) {
        result.assert = assert;
    }

    return result;
}

function getDo(step) {
    if (!step.action) {
        return null;
    }
    
    return step.args.length === 0 ? step.action : { [step.action]: step.args };
}

function getAssert(step) {
    if (!step.assert) {
        return null;
    }

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
