# Getting Started

## cypress-app-actions

1. Install App Actions and Cypress: `yarn add -D cypress @appactions/cypress-app-actions`

2. Add plugin to Cypress plugin file:

```
const { addPlugin } = require('@appactions/cypress-app-actions/plugin');

module.exports = on => {
    addPlugin(on);
};
```

3. Register the Cypress commands in the support file:

```
import { registerCypressCommands, refreshSubject } from '@appactions/cypress-app-actions';

registerCypressCommands();

// using the refrsh feature is optional
Cypress.Commands.overwrite('click', (click, subject, ...args) => {
    return click(refreshSubject(subject), ...args);
});
```

4. Add the drivers:

```
import { register } from '@appactions/cypress-app-actions/driver';

register(Cell, {
    role: 'CellRole',
});
```

5. Create the testables in the support folder.

```
import { createTestable } from '@appactions/cypress-app-actions';

export const Game = createTestable({
    role: 'GameRole',
});
```

Ready to write tests.
