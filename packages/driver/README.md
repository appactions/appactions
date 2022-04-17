# App Actions Driver

Usage:

```javascript
import { createDriver, tunnel } from '@appactions/driver';

function MyComponent(props) {
    // ...
}

createDriver(MyComponent, {
    pattern: 'Filter',
    getName: ({ $el }) => $el.text().trim(),
    actions: {
        set: filter => {
            // ...
        },
    },
    tunnel: {
        set: (prev, current) => {
            if (prev.pattern === current.pattern && prev.action === current.action) {
                return [null, current];
            }
            return [prev, current];
        },
    },
});
```
