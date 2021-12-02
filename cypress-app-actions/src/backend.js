import { attach } from './vendor/react-devtools-renderer-build/renderer';

export function renderer(hook, rendererID, renderer, global) {
    const devtoolsInterface = attach(hook, rendererID, renderer, global);

    const {
        getFiberIDForNative,
        findCurrentFiberUsingSlowPathById,
        findNativeNodesForFiberID,
        getOrGenerateFiberID,
        getDisplayNameForFiber,
        flushInitialOperations,
        handleCommitFiberUnmount,
        handleCommitFiberRoot,
    } = devtoolsInterface;

    const findFiber = subject => {
        let id;

        // hack, instanceof Element is not working reliably
        if (typeof subject.querySelector === 'function') {
            id = getFiberIDForNative(subject);

            if (!id) {
                // try the getOrGenerateFiberID way instead
                const fiberProp = Object.keys(subject).find(prop => prop.startsWith('__reactFiber$'));
                if (fiberProp) {
                    id = getOrGenerateFiberID(subject[fiberProp]);
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

    return {
        findFiber,
        getParentFiber, // going to replace findFiberForInteraction
        findFiberForInteraction,
        findNativeNodes,
        listFibersByPredicate,
        findAncestorElementByPredicate,
        getDisplayNameForFiber,
        getOwner,
        flushInitialOperations,

        // react calls these to communicate the component tree
        handleCommitFiberUnmount,
        handleCommitFiberRoot,

        // for debug only
        devtoolsInterface,
    };
}
