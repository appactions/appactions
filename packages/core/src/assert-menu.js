export function setupAssertMenu(bridge, agent) {
    const contentWindow = window.__APP_ACTIONS_TARGET_WINDOW__ || window;
    contentWindow.document.addEventListener('contextmenu', event => {
        event.preventDefault();

        bridge.send('contextmenu-open', {
            x: event.x,
            y: event.y,
            pageX: event.pageX,
            pageY: event.pageY,
            screenX: event.screenX,
            screenY: event.screenY,
            clientX: event.clientX,
            clientY: event.clientY,
        });
    });
}
