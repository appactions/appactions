import { builtInActions } from './built-in-actions';

if (!Cypress.AppActions) {
    Cypress.AppActions = {
        isRepresentingRole: fiber => {
            return !!getDriver(fiber);
        },
    };
}

export function getRawDriver(fiber) {
    if (!fiber.type) {
        return null;
    }

    // host components
    if (typeof fiber.type === 'string') {
        return Cypress.$autIframe[0].contentWindow.__REACT_APP_ACTIONS__.drivers[fiber.type] || null;
    }

    if (!fiber.type.__REACT_APP_ACTIONS__) {
        return null;
    }

    return fiber.type.__REACT_APP_ACTIONS__;
}

const defaultGetName = () => null;

export function getDriver(fiber) {
    const driver = getRawDriver(fiber);

    if (!driver) {
        return null;
    }

    const result = Object.create(driver);
    result.actions = {
        ...builtInActions,
        ...result.actions,
    };
    result.getName = result.getName || defaultGetName;
    return result;
}

export function getFiberInfo(fiber) {
    const nodes = Cypress.AppActions.reactApi.findNativeNodes(fiber);
    const hooks = Cypress.AppActions.reactApi.listActionHooksOfFiber(fiber);
    const driver = getDriver(fiber);
    return {
        nodes,
        $el: Cypress.$(nodes),
        fiber,
        instance: fiber.stateNode || null,
        driver,
        hooks,
    };
}

export const isJquery = obj => !!(obj && obj.jquery && typeof obj.constructor === 'function');

export function getDisplayName(fiber) {
    return Cypress.AppActions.reactApi.getDisplayNameForFiber(fiber);
}

export function isRole(name) {
    return Cypress.$autIframe[0].contentWindow.__REACT_APP_ACTIONS__.patterns.has(name);
}

const isPartOfRole = pattern => fiber => {
    const driver = getDriver(fiber);
    if (!driver) {
        return false;
    }
    return pattern === driver.pattern;
};

const hasMatchingName = componentName => fiber => {
    const displayName = getDisplayName(fiber);
    return displayName === componentName;
};

export const findClosestStateNode = fiber => {
    if (fiber.stateNode) {
        return fiber.stateNode;
    }

    let current = fiber.child;
    while (current !== null) {
        const instance = findClosestStateNode(current);
        if (instance) {
            return instance;
        }
        current = current.sibling;
    }

    return null;
};

export function findElementByPredicate(fiber, predicate) {
    const matches = Cypress.AppActions.reactApi.listFibersByPredicate(fiber, predicate);
    return matches.flatMap(Cypress.AppActions.reactApi.findNativeNodes);
}

export function findElementByRole(fiber, pattern) {
    return findElementByPredicate(fiber, isPartOfRole(pattern));
}

export function findElementByReactComponentName(fiber, componentName) {
    return findElementByPredicate(fiber, hasMatchingName(componentName));
}

export function listFiberByRole(fiber, pattern) {
    return Cypress.AppActions.reactApi.listFibersByPredicate(fiber, isPartOfRole(pattern));
}

export function listFiberForInteraction(fiber, pattern) {
    const isMatching = fiber => {
        const driver = getDriver(fiber);

        if (!driver) {
            return false;
        }

        return pattern === driver.pattern;
    };

    return Cypress.AppActions.reactApi.listFibersByPredicate(fiber, isMatching);
}

export function findAncestorElementByPredicate(fiber, predicate) {
    const parent = Cypress.AppActions.reactApi.findAncestorElementByPredicate(fiber, predicate);
    if (!parent) {
        return [];
    }
    return Cypress.AppActions.reactApi.findNativeNodes(parent);
}

export function findAncestorElementByRole(fiber, pattern) {
    return findAncestorElementByPredicate(fiber, isPartOfRole(pattern));
}

export function findAncestorElementByReactComponentName(fiber, componentName) {
    return findAncestorElementByPredicate(fiber, hasMatchingName(componentName));
}

export function findOverride($root, pattern) {
    throw new Error('Override API is not supported anymore');
}

export function getParentsWithDriver(fiber) {
    const result = [];

    Cypress.AppActions.reactApi.findAncestorElementByPredicate(fiber, fiber => {
        // if they have a driver, add the fiber to result
        if (getDriver(fiber)) {
            result.unshift(fiber);
        }

        // we want to go up all to the top
        return false;
    });

    return result;
}