if (!Cypress.AppActions) {
    Cypress.AppActions = {
        drivers: {},
        componentByRole: {},
        roles: new Set(),
        overrides: {},
        setFiberRoots: fiberRoots => {
            Cypress.AppActions.__fiberRoots = fiberRoots;
        },
        getAllRoots: () => {
            if (!Cypress.AppActions.__fiberRoots) {
                throw new Error('Could not find any React roots');
            }

            // this logic cannot go to the setter, because of mutation
            return Object.values(Cypress.AppActions.__fiberRoots)
                .flatMap(set => Array.from(set))
                .map(rootNode => rootNode.current);
        },
        isRepresentingRole: fiber => {
            // const displayName = Cypress.AppActions.reactApi.getDisplayNameForFiber(fiber);
            // const hasRole = Object.prototype.hasOwnProperty.call(componentByRole, displayName)
            // return hasRole;

            return !!fiber.type.__REACT_APP_ACTIONS__;
        },
    };
}

const { drivers, componentByRole, roles, overrides } = Cypress.AppActions;

export function register(componentName, driverConfig) {
    if (drivers[componentName]) {
        throw new Error(`name collision: ${componentName} already has drivers registered`);
    }

    // some drivers don't implement actual drivers, just registered for a role
    if (driverConfig.drivers) {
        drivers[componentName] = driverConfig.drivers;
    }

    // some drivers don't have a role, for example DataTableHeader only has a driver, but not a Table itself
    if (driverConfig.role) {
        componentByRole[componentName] = driverConfig.role;
        roles.add(driverConfig.role);
    }

    if (driverConfig.override) {
        overrides[componentName] = driverConfig.override;
    }
}

export const isJquery = obj => !!(obj && obj.jquery && typeof obj.constructor === 'function');

export function getDisplayName(fiber) {
    return Cypress.AppActions.reactApi.getDisplayNameForFiber(fiber);
}

export function isRole(name) {
    return roles.has(name);
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

const isPartOfRole = role => fiber => {
    const displayName = getDisplayName(fiber);
    return componentByRole[displayName] === role;
};

const hasMatchingName = componentName => fiber => {
    const displayName = getDisplayName(fiber);
    return displayName === componentName;
};

const findInstancesWithSpecificInteraction = (fiber, methodName) => {
    const isMatching = fiber => {
        const displayName = getDisplayName(fiber);

        if (drivers[displayName]) {
            if (drivers[displayName][methodName]) {
                return true;
            }
        }

        return false;
    };

    return Cypress.AppActions.reactApi.listFibersByPredicate(fiber, isMatching);
};

const findClosestStateNode = fiber => {
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

export function callInteraction($el, methodName, ...args) {
    const el = unwrapJQuery($el);
    const rootFiber = Cypress.AppActions.reactApi.findFiberForInteraction(el);

    const matches = findInstancesWithSpecificInteraction(rootFiber, methodName);

    if (matches.length === 0) {
        throw new Error(`Couldn't find instance with "${methodName}" interaction`);
    }

    if (matches.length > 1) {
        throw new Error(
            `Found more then one instances with "${methodName}" interaction. Narrow down the selection to match exactly a single element.`,
        );
    }

    const [fiber] = matches;

    const componentName = getDisplayName(fiber);

    if (!drivers[componentName]) {
        throw new Error(`Component ${componentName} has no drivers registered`);
    }

    const componentMap = drivers[componentName];
    if (!componentMap[methodName]) {
        throw new Error(`Component ${componentName} has no interaction registered with name ${methodName}`);
    }

    // TODO this will find any stateNode among the children, when we are adding function component support, return a null here in that case
    const stateNode = findClosestStateNode(fiber);
    const DOMNode = Cypress.AppActions.reactApi.findNativeNodes(fiber);

    return componentMap[methodName].apply(null, args).call(null, Cypress.$(DOMNode), stateNode);
}

export function findElementByPredicate(fiber, predicate) {
    const matches = Cypress.AppActions.reactApi.listFibersByPredicate(fiber, predicate);
    return matches.flatMap(Cypress.AppActions.reactApi.findNativeNodes);
}

export function findElementByRole(fiber, role) {
    return findElementByPredicate(fiber, isPartOfRole(role));
}

export function findElementByReactComponentName(fiber, componentName) {
    return findElementByPredicate(fiber, hasMatchingName(componentName));
}

export function findAncestorElementByPredicate(fiber, predicate) {
    const parent = Cypress.AppActions.reactApi.findAncestorElementByPredicate(fiber, predicate);
    if (!parent) {
        return [];
    }
    return Cypress.AppActions.reactApi.findNativeNodes(parent);
}

export function findAncestorElementByRole(fiber, role) {
    return findAncestorElementByPredicate(fiber, isPartOfRole(role));
}

export function findAncestorElementByReactComponentName(fiber, componentName) {
    return findAncestorElementByPredicate(fiber, hasMatchingName(componentName));
}

// TODO expect fiber instead of $root
export function findOverride($root, role) {
    const el = unwrapJQuery($root);
    const fiber = Cypress.AppActions.reactApi.findFiberForInteraction(el);

    // only care for a single match
    // maybe we should do something smarter?
    const [matchingFiber] = Cypress.AppActions.reactApi.listFibersByPredicate(fiber, isPartOfRole(role));
    if (!matchingFiber) {
        return null;
    }

    const componentName = getDisplayName(matchingFiber);

    return overrides[componentName] || null;
}
