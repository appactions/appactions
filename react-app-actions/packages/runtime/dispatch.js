import { computeAccessibleName } from 'dom-accessibility-api';
import { roles as allRoles } from 'aria-query';

export async function dispatch(renderer, command) {
    console.log('roots', { roots, computeAccessibleName, allRoles });
    const roots = renderer.getFiberRoots();
    renderer.listFibersByPredicate(roots[0].current, fiber => {
        console.log('visited:', renderer.getDisplayName(fiber));
        return false;
    });
    debugger;
    return false;
}
