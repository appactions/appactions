import { read, validate, flatten, parse, resolve } from './flow';
import Runner from './runner';

export async function run() {
    const flows = await read().then(flows =>
        flows
            .filter(flow => Boolean(flow.content))
            .map(parse)
            .map(flatten)
            .map(resolve)
            .filter(validate),
    );

    let errors = null;
    try {
        for await (let flow of flows) {
            const runner = new Runner(flow);
            errors = await runner.run();
        }
    } catch (e) {
        console.log('Error occured outside of test scope');
        throw e;
    }

    if (errors) {
        console.log('Tests are failing.');
        console.log('There are', errors.length, 'error(s).');
        console.log();
        process.exit(1);
    } else {
        console.log('Tests are passing.');
    }
}
