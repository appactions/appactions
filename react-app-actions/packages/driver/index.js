const roles = new Map();
const drivers = new Map();

export function register(Component, { role, ...driverFunctions }) {
    roles.set(Component, role);
    drivers.set(Component, driverFunctions);

    Object.defineProperty(Component, '__REACT_APP_ACTIONS__', {
        enumerable: false,
        get() {
            return {
                roles,
                drivers,
            };
        },
    });
}
