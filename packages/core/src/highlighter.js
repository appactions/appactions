import Overlay from './overlay';
import { getFiberInfo } from './api';

export function setupHighlighter(bridge, agent) {
    bridge.addListener('highlightNativeElement', highlightNativeElement);
    bridge.addListener('clearNativeElementHighlight', hideOverlay);
    bridge.addListener('shutdown', hideOverlay);

    let overlay = null;

    function hideOverlay() {
        if (overlay !== null) {
            overlay.remove();
            overlay = null;
        }
    }

    function showOverlay(elements, pattern, name) {
        if (elements == null) {
            return;
        }

        if (overlay === null) {
            overlay = new Overlay();
        }

        overlay.inspect(elements, pattern, name);
    }

    function highlightNativeElement({
        displayName,
        hideAfterTimeout,
        id,
        openNativeElementsPanel,
        rendererID,
        scrollIntoView,
    }) {
        // debugger;
        const renderer = agent.rendererInterfaces[rendererID];
        if (renderer == null) {
            console.warn(`Invalid renderer id "${rendererID}" for element "${id}"`);
        }

        let nodes = null;
        if (renderer != null) {
            nodes = renderer.findNativeNodesForFiberID(id);
        }

        if (nodes != null && nodes[0] != null) {
            const node = nodes[0];
            if (scrollIntoView && typeof node.scrollIntoView === 'function') {
                node.scrollIntoView({ block: 'nearest', inline: 'nearest' });
            }

            let pattern = '';
            let name = 'null';

            const fiber = Cypress.AppActions.reactApi.findCurrentFiberUsingSlowPathById(id);
            const fiberInfo = getFiberInfo(fiber);
            if (fiberInfo.driver) {
                pattern = fiberInfo.driver.pattern;

                if (fiberInfo.driver.getName) {
                    name = fiberInfo.driver.getName(fiberInfo);
                }
            }

            showOverlay(nodes, pattern, name);

            if (openNativeElementsPanel) {
                window.__REACT_DEVTOOLS_GLOBAL_HOOK__.$0 = node;
                bridge.send('syncSelectionToNativeElementsPanel');
            }
        } else {
            hideOverlay();
        }
    }
}
