// TODO i think these should be private, but not sure
// export {
//     callInteraction,
//     findElementByRole,
//     findElementByPredicate,
//     findElementByReactComponentName,
//     findAncestorElementByRole,
//     findAncestorElementByReactComponentName,
//     isRole,
//     register,
//     getDisplayName,
// } from './api';

// used by the drivers
export { register } from './api';

// used by testable
export { createTestable, pure, sideEffect } from './testable-tools';

// useful in specs
export { expectToFailWithMessage } from './utils';

// used in Cypress support file
export { registerCypressCommands } from './cypress/commands';

// TODO private as well? used by the cy commands only
// export { refreshSubject } from './cypress/cypress-utils';

// TODO private? used by the jQuery fns internally
// export { vDomFind, vDomCallDriver, vDomClosest } from './vdom-utils';
