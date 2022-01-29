export function dispatchHelper(dispatch) {
    window.__dispatch = dispatch;
}

export function actionHelper(name, ...args) {
    switch (name) {
        case 'add':
            window.__dispatch({ type: 'ADD_TODO', id: args[0], title: args[1] });
            break;
        case 'set':
            window.__dispatch({ type: 'SET_FILTER', filter: args[0] });
            break;
        case 'toggle':
            window.__dispatch({ type: 'TOGGLE_TODO', id: args[0] });
            break;
        case 'remove':
            window.__dispatch({ type: 'REMOVE_TODO', id: args[0] });
            break;
    }
}
