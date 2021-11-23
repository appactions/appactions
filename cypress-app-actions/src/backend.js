import { attach } from './vendor/react-devtools-renderer-build';

export function renderer(hook, rendererID, renderer, global) {
    const devtoolsInterface = attach(hook, rendererID, renderer, global);

    const {
        getFiberIDForNative,
        findCurrentFiberUsingSlowPathById,
        findNativeNodesForFiberID,
        getOrGenerateFiberID,
        getDisplayNameForFiberID,
    } = devtoolsInterface;

    const findFiber = subject => {
        let id;

        if (subject instanceof HTMLElement) {
            id = getFiberIDForNative(element);

            if (!id) {
                // try the getOrGenerateFiberID way instead
                const fiberProp = Object.keys(element).find(prop => prop.startsWith('__reactFiber$'));
                if (fiberProp) {
                    id = getOrGenerateFiberID(element[fiberProp]);
                }
            }
        } else {
            // assume it's a fiber already
            id = getOrGenerateFiberID(subject);
        }

        if (!id) {
            throw new Error('could not locate React node for DOM element');
        }

        return findCurrentFiberUsingSlowPathById(id);
    };

    const getParentFiber = subject => {
        // TODO find the oldest parent, which returns the same host nodes as the argument
        // this should replace findFiberForInteraction

        throw new Error('not implemented');
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
    const findNativeNodes = fiber => findNativeNodesForFiberID(getOrGenerateFiberID(fiber));
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

    const getDisplayName = fiber => getDisplayNameForFiberID(getOrGenerateFiberID(fiber));

    return {
        findFiber,
        getParentFiber, // going to replace findFiberForInteraction
        findFiberForInteraction,
        findNativeNodes,
        listFibersByPredicate,
        findAncestorElementByPredicate,
        getDisplayName,
        getOwner,

        // react calls these i guess
        handleCommitFiberUnmount: devtoolsInterface.handleCommitFiberUnmount,
        handleCommitFiberRoot: devtoolsInterface.handleCommitFiberRoot,

        // for debug only
        devtoolsInterface,
    };
}
