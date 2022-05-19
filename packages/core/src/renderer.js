import { attach as attachVendor } from './vendor/react-devtools-renderer-build/renderer';

export function attach(hook, rendererID, renderer, global) {
    const devtoolsInterface = attachVendor(hook, rendererID, renderer, global);

    const {
        getFiberIDForNative,
        findCurrentFiberUsingSlowPathById,
        findNativeNodesForFiberID,
        getOrGenerateFiberID,
        getDisplayNameForFiber,
        flushInitialOperations,
        handleCommitFiberUnmount,
        handleCommitFiberRoot,
        inspectElement,
        inspectHooksOfFiber,
        isUsingHooks,
        assertIsMounted,
        isFiberHostComponent,
    } = devtoolsInterface;

    const isFiberMounted = fiber => {
        try {
            assertIsMounted(fiber);
            return true;
        } catch (e) {
            return false;
        }
    };

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
    const findFiberForInteraction = elements => {
        let fiber = findFiber(elements[0]);

        // find the highest parent, which returns the same dom nodes as the argument
        while (fiber.return) {
            const els = findNativeNodes(fiber.return);

            if (els.length !== elements.length) {
                return fiber;
            }

            if (els.some(el => elements.find(e => e === el) === undefined)) {
                return fiber;
            }

            fiber = fiber.return;
        }

        return fiber;
    };
    const findNativeNodes = fiber => {
        if (isFiberMounted(fiber)) {
            return findNativeNodesForFiberID(getOrGenerateFiberID(fiber));
        }
        if (isFiberHostComponent(fiber)) {
            return [fiber.stateNode];
        }
        return null;
    };
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
        do {
            if (predicate(fiber)) {
                return fiber;
            }
        } while ((fiber = fiber.return));

        return null;
    };

    const listActionHooksOfFiber = fiber => {
        if (!isUsingHooks(fiber)) {
            return null;
        }

        const reactHooks = inspectHooksOfFiber(fiber, renderer.currentDispatcherRef);
        const actionHooks = reactHooks.filter(hook => hook.name === 'State' && hook.value && hook.value.useAction);

        return actionHooks.map(hook => hook.value);
    };

    const useAction = (config, callback) => {
        const dispatcher = Cypress.AppActions.hook.renderers.get(1).currentDispatcherRef;

        const data = {
            pattern: config.pattern,
            action: config.action,
            callback,
            useAction: true,
        };

        const [ref] = dispatcher.current.useState(() => data);
        ref.callback = callback;
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
        inspectElement,
        findCurrentFiberUsingSlowPathById,
        getOrGenerateFiberID,
        findNativeNodesForFiberID,
        isFiberMounted,

        // react calls these to communicate the component tree
        handleCommitFiberUnmount,
        handleCommitFiberRoot,

        // hooks stuff
        listActionHooksOfFiber,
        useAction,

        // for debug only
        devtoolsInterface,
    };
}
