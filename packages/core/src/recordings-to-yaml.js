import json2yaml from './json-to-yaml';

export default function renderYAML(meta, events) {
    if (events.length === 0) {
        return '# empty test';
    }

    const result = {
        description: meta.description,
        start: {
            route: meta.start.route,
            auth: meta.start.auth,
        },
        steps: events.map(event => ({
            with: event.owners.length === 1 ? processOwner(event.owners[0]) : event.owners.map(processOwner),
            do: event.args.length === 0 ? event.action : { [event.action]: event.args },
        })),
    };
    
    return json2yaml(result);
}

function processOwner({ name, pattern }) {
    return name ? { [pattern]: name } : pattern;
}
