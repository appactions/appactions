import { computeAccessibleName } from 'dom-accessibility-api';
import { roles as allRoles, elementRoles } from 'aria-query';

export async function dispatch(renderer, command) {
    console.log('roots', { roots, computeAccessibleName, allRoles, elementRoles: Array.from(elementRoles) });
    const roots = renderer.getFiberRoots();
    renderer.listFibersByPredicate(roots[0].current, fiber => {
        // if (fiber.type && fiber.type.__REACT_APP_ACTIONS__) {
        //     console.log('visited:', renderer.getDisplayName(fiber), fiber.type.__REACT_APP_ACTIONS__);
        // }

        if (fiber.stateNode instanceof HTMLElement) {
            console.log('visited:', renderer.getDisplayName(fiber), computeAccessibleName(fiber.stateNode));
        }

        return false;
    });
    debugger;
    return false;
}
