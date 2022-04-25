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
        id,
    }) {
        const fiber = Cypress.AppActions.reactApi.findCurrentFiberUsingSlowPathById(id);
        const nodes = Cypress.AppActions.reactApi.findNativeNodes(fiber);

        if (nodes != null && nodes[0] != null) {
            let pattern = null;
            let name = null;

            const fiberInfo = getFiberInfo(fiber);
            if (fiberInfo.driver) {
                pattern = fiberInfo.driver.pattern;

                if (fiberInfo.driver.getName) {
                    name = fiberInfo.driver.getName(fiberInfo);
                }
            }

            showOverlay(nodes, pattern, name);
        } else {
            hideOverlay();
        }
    }
}
