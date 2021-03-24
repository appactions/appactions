export async function dispatch(renderer, command) {
    const roots = renderer.getFiberRoots();
    // console.log('dispatched', roots, command);
    console.log('roots', roots);
    debugger;
    return false;
}
