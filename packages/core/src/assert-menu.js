import Menu from './menu';
import ReactDOM from 'react-dom';

export function setupAssertMenu(bridge, agent) {
    const contentWindow = window.__APP_ACTIONS_TARGET_WINDOW__ || window;
    contentWindow.document.addEventListener('contextmenu', event => {
        event.preventDefault();

        const container = contentWindow.document.createElement('div');
        Object.assign(container.style, {
            // display: 'none',
            zIndex: 10000000,
            position: 'absolute',
            top: 0,
            left: 0,
        });

        contentWindow.document.body.appendChild(container);

        ReactDOM.render(<Menu />, container);
    });
}
