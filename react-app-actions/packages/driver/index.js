const roles = new Map();
const drivers = new Map();

export function register(Component, { role, ...driverFunctions }) {
    roles.set(Component, role);
    drivers.set(Component, driverFunctions);
}

window.ReactAppActionsBackend.driverApi = {
    roles,
    drivers,
};
