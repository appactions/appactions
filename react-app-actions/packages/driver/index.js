const roles = new Map();
const drivers = new Map();

export function register(Component, { role, ...driverFunctions }) {
    roles.set(Component, role);
    drivers.set(Component, driverFunctions);

    console.log('register', Component, roles, drivers);
}

// window.ReactAppActionsBackend.driverApi = {
//     roles,
//     drivers,
// };
