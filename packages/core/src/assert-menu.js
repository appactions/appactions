export function setupAssertMenu(bridge, agent) {
    const contentWindow = window.__APP_ACTIONS_TARGET_WINDOW__ || window;
    contentWindow.document.addEventListener('contextmenu', event => {
        event.preventDefault();

        console.log('contextmenu', event);
    });
}
