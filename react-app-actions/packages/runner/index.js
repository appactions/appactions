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

    let error;
    try {
        for await (let flow of flows) {
            const runner = new Runner(flow);
            await runner.run();
        }
    } catch (e) {
        error = e;
    }

    if (error) {
        console.log('Tests are failing.');
        console.log();
        console.log(error);
        process.exit(1);
    } else {
        console.log('Tests are passing.');
    }
}
