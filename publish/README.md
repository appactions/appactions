# App Actions

App Actions is a utility library and developer tool for writing end-to-end (E2E) tests for React apps. It's a test runner agnostics solution that integrates with Cypress and Selenium*.

**Out of the box Selenium support is work in progress.*

App Actions helps to solve the following problems:

- Speed up the test writing process.
- Minimize the amount of work needed for test maintenance.
- Optimize test running speed.
- Enable non-frontend developers to write automation tests.

## Getting started

1. Install App Actions and Cypress: `yarn add -D cypress @appactions/cypress`

**Note:** Before installation, an NPM token will be required. Add the following to the `.npmrc` file:

```
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
```

2. Insert the Cypress plugin at the plugin file:

```
const { addPlugin } = require('@appactions/cypress/plugin');

module.exports = on => {
  addPlugin(on);
};
```

The plugin will install the developer tool (a browser extension) to the automated browser window.

3. Register the Cypress commands in the support file:

```
import { registerCypressCommands } from '@appactions/cypress';

registerCypressCommands();
```

This function will add the `cy.with` and `cy.do` command to the Cypress runtime, alongside with some jQuery helpers.

4. Add the drivers:

```
import { createDriver } from '@appactions/cypress/driver';

createDriver(TextInput, {
  role: 'Input',
});
```

In computing, a driver is a program that helps to connect a component to the primary system. In App Actions, a driver connects a React component to the test runner, enabling the App Actions ✨magic✨.

5. Create a testable in the support folder.

Testables represent UX patterns. A pattern can have one or many implementations. For example, if an app has `<Table />` and `<AdvancedTable />`, perhaps both components implement the same `Table` pattern.

How to decide if a set of components should have a single or multiple testables linked to them? A good rule of thumb is to ask, "does the user think these elements have different goals or kinda do the same?".

**Note:** this concept is about to be gone. In the future, drivers will be the only App Actions API.

Example:

```
import { createTestable } from '@appactions/cypress';

// name it anything that describes the given UX pattern
export const App = createTestable({
  role: 'App', // mandatory field
});
```

Ready to write tests. You can check your integration with the following Hello World test:

```
import { App } from ‘../support/testables’;

describe(‘Foo’, () => {
  it(‘Bar’, () => {
    cy.visit(‘/‘);
    cy.with(App).should(‘exist’);
  });
});
```

## E2E concepts to understand

Here is some concept in end-to-end testing, which will make this document easier to understand:

### Selection, interactions, and assertion

E2E tests are just three types of commands in a sequence: (1) select an element, (2) perform an interaction, (3) do an assertion on the state. Build a list of this loop, and call it a day.

In the App Actions Cypress version, we provide `cy.with` for selection, `cy.do` for interaction. For assertion, we simply use the built in `cy.should` commands.

### Retry-ability

When outside circumstances can cause errors in a system, retrying a step until it works could be a solution. In E2E tests, when many components work together, it's inevitable to encounter errors that are not the tested application's fault. For this reason, most modern testing tools use retriability: when a test fails, repeat until it passes or times out.

### Timeout value

When the desired behavior does not occur despite retrying, the test runner will give up and register the test as failing. This interval is called the timeout value. If it's too short, many false positives will happen, making the test feel flaky. If it's too long, the feedback will be unnecessarily slow. Using a single value for everything is suboptimal. A good test runner must make smart predictions about the best timeout.

This is why the App Actions drivers can communicate hints, like loading state, which helps sustain stability when external components experience hiccups.

## Creating drivers

The `register` function’s config has 3 fields: `role`, `selectors`, and `interactions`.

`role` is the only mandatory field, defining what role does this component responsible for. 

`selectors` is an object that represents a key/function map of methods. These methods are pure functions, and their goal is to return values from a given component instance. For example, a `Table` pattern can have a selector called `getRowData` that returns data from a given row. These functions must be pure because the test runner will retry them on failure.

`interations` is the same as the `selectors` object, but these methods simulate user interactions on a given component instance. Because an interaction is a function with a side effect most of the time, these functions are not retried, but it's possible to mark certain parts as "pure", so certain subtasks can be prone to failure.

## Creating testables

The `createTestable` functions’s config has 5 (double check) fields:

- `role` (mandatory)
- `isLoading`
- `getName`
- `interactions`
- `selectors`

`role` is the same as in the driver, a string that defines what pattern does this testable implements.

`isLoading` is a function that gets the components instance as an argument. It returns a boolean value, defining whether is that instance is in a loading state or not. When an instance is selected for interaction or assertion, but it's in a loading state, the test runner can handle this case gracefully and give extra time for that component to catch up. This is an effective way to handle occasional hiccups in the backend: sometimes a 3rd party service can be slower than usual, but instead of setting the default timeout value to a greater number (making the overall performance slower), we can help the test runner to recognize this unusual case, and allow it to wait.

`getName` is a function that returns a string that is a "good name" for a given component. For example, if it's a button, this string can be the label. Instead of referencing an element by a technical attribute, like its CSS selector or test-id, names let us use something meaningful for users. This decreases the maintenance cost because only UX changes will require updates in the test code.

`interactions` 

TODO

`selectors`

TODO

## Misc feature

### jQuery Helpers

```
$(el).vDomFind(‘.foo Pattern1 Pattern2’);
```
Returns the DOM node rendered by Pattern2.

TODO

### Subject refresh

Subject refresh is a Cypress-specific feature. Cypress has a long-standing bug, in which it's failing with the error `element is detached from the DOM`. Refreshing the subject is a solution to this problem.

You have to manually enable it on each built-in Cypress command, like this:

```
import { refresh } from '@appactions/cypress';

Cypress.Commands.overwrite('click', (click, subject, ...args) => {
  return click(refresh(subject), ...args);
});
```

## License

UNLICENSED
