import { attach } from './vendor/react-devtools-renderer';

export function attachAppActionsRenderer(hook, rendererID, renderer, global) {
    const devtoolsInterface = attach(hook, rendererID, renderer, global);

    const {
        getFiberIDForNative,
        findCurrentFiberUsingSlowPathById,
        findNativeNodesForFiberID,
        getFiberID,
        getPrimaryFiber,
        getDisplayNameForFiberID,
    } = devtoolsInterface;

    const findFiber = element => {
        const id = getFiberIDForNative(element);

        if (!id) {
            throw new Error('could not locate React node for DOM element');
        }

        return findCurrentFiberUsingSlowPathById(id);
    };
    // use when looking for a fiber because want to run an interaction on it
    const findFiberForInteraction = element => {
        let fiber = findFiber(element);

        // find the highest parent, which returns the same dom nodes as the argument
        while (fiber.return) {
            const els = findNativeNodes(fiber.return);

            if (els.length !== 1) {
                return fiber;
            }

            if (els[0] !== element) {
                return fiber;
            }

            fiber = fiber.return;
        }

        return fiber;
    };
    const findNativeNodes = fiber => findNativeNodesForFiberID(getFiberID(getPrimaryFiber(fiber)));
    const getOwner = fiber => {
        if (fiber._debugOwner) {
            return fiber._debugOwner;
        }

        // TODO when does the `_debugOwner` missing?
        throw new Error('`getOwner` was called on a fiber that has no owner');
    };
    const listFibersByPredicate = (fiber, predicate) => _listFibersByPredicate(fiber, predicate, true);
    const _listFibersByPredicate = (fiber, predicate, head) => {
        const isMatch = predicate(fiber);
        const results = isMatch ? [fiber] : [];
        if (isMatch && head) {
            return results;
        }
        let next = isMatch ? fiber.sibling : fiber.child;
        while (next !== null) {
            const newResults = listFibersByPredicate(next, predicate, false);
            results.push(...newResults);
            next = next.sibling;
        }
        return results;
    };

    const findAncestorElementByPredicate = (fiber, predicate) => {
        while ((fiber = fiber.return)) {
            if (predicate(fiber)) {
                return fiber;
            }
        }

        return null;
    };

    const getDisplayName = fiber => getDisplayNameForFiberID(getFiberID(getPrimaryFiber(fiber)));

    return {
        findFiber,
        findFiberForInteraction,
        findNativeNodes,
        listFibersByPredicate,
        findAncestorElementByPredicate,
        getDisplayName,
        getOwner,

        // react calls these i guess
        handleCommitFiberUnmount: devtoolsInterface.handleCommitFiberUnmount,
        handleCommitFiberRoot: devtoolsInterface.handleCommitFiberRoot,
    };
}
