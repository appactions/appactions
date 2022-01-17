export function setupHighlighter(bridge, agent) {
    bridge.addListener('highlightNativeElement', highlightNativeElement);
    bridge.addListener('clearNativeElementHighlight', clearNativeElementHighlight);
    bridge.addListener('shutdown', clearNativeElementHighlight);
}

function highlightNativeElement({
    displayName,
    hideAfterTimeout,
    id,
    openNativeElementsPanel,
    rendererID,
    scrollIntoView,
}) {
    // TODO
    console.log('highlightNativeElement', id);
}

function clearNativeElementHighlight() {
    // TODO
    console.log('clearNativeElementHighlight');
}
