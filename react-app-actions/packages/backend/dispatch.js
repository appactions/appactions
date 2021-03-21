export async function dispatch(command) {
    console.log('dispatched', command.with);
    return false;
}
