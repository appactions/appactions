if (!Cypress.AppActions) {
    Cypress.AppActions = {
        isRepresentingRole: fiber => {
            return !!getDriver(fiber);
        },
    };
}

export function getDriver(fiber) {
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

export const isJquery = obj => !!(obj && obj.jquery && typeof obj.constructor === 'function');

export function getDisplayName(fiber) {
    return Cypress.AppActions.reactApi.getDisplayNameForFiber(fiber);
}

export function isRole(name) {
    return Cypress.$autIframe[0].contentWindow.__REACT_APP_ACTIONS__.patterns.has(name);
}

function unwrapJQuery(el) {
    if (isJquery(el)) {
        if (!el.length) {
            throw new Error('empty jQuery selector were passed to App Actions API');
        }
        if (el.length > 1) {
            throw new Error(
                'jQuery selector were passed to App Actions API with multiple element selected. Only one supported.',
            );
        }
    }

    return isJquery(el) ? el.get(0) : el;
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

// deprecated
const findInstancesWithSpecificInteraction = (fiber, actionName) => {
    const isMatching = fiber => {
        const driver = getDriver(fiber);
        if (!driver) {
            return false;
        }

        if (driver.actions[actionName]) {
            return true;
        }

        return false;
    };

    return Cypress.AppActions.reactApi.listFibersByPredicate(fiber, isMatching);
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

export function callInteraction($el, actionName, ...args) {
    const el = unwrapJQuery($el);
    const rootFiber = Cypress.AppActions.reactApi.findFiberForInteraction(el);

    const matches = findInstancesWithSpecificInteraction(rootFiber, actionName);

    if (matches.length === 0) {
        throw new Error(`Couldn't find instance with "${actionName}" interaction`);
    }

    if (matches.length > 1) {
        throw new Error(
            `Found more then one instances with "${actionName}" interaction. Narrow down the selection to match exactly a single element.`,
        );
    }

    const [fiber] = matches;

    const componentName = getDisplayName(fiber);

    const driver = getDriver(fiber);
    if (!driver) {
        throw new Error(`Component ${componentName} has no drivers registered`);
    }
    const method = driver.actions[actionName];
    if (!method) {
        throw new Error(`Component ${componentName} has no interaction registered with name ${actionName}`);
    }

    // TODO this will find any stateNode among the children, when we are adding function component support, return a null here in that case
    const stateNode = findClosestStateNode(fiber);
    const DOMNode = Cypress.AppActions.reactApi.findNativeNodes(fiber);

    // return componentMap[actionName].apply(null, args).call(null, Cypress.$(DOMNode), stateNode);
    return method.apply(null, args).call(null, Cypress.$(DOMNode), stateNode);
}

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

export function listFiberForInteraction(fiber, pattern, actionName) {
    const isMatching = fiber => {
        const driver = getDriver(fiber);
        
        if (!driver) {
            return false;
        }

        if (!pattern === driver.pattern) {
            return false;
        }

        if (driver.actions[actionName]) {
            return true;
        }

        return false;
    };

    return Cypress.AppActions.reactApi.listFibersByPredicate(fiber, isMatching);
};

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
    throw new Error('Override API is not supported in this version');
}
