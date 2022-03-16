class OverlayRect {
    constructor(doc, container) {
        this.node = doc.createElement('div');
        this.border = doc.createElement('div');
        this.padding = doc.createElement('div');
        this.content = doc.createElement('div');

        this.border.style.borderColor = overlayStyles.border;
        this.padding.style.borderColor = overlayStyles.padding;
        this.content.style.backgroundColor = overlayStyles.background;

        Object.assign(this.node.style, {
            borderColor: overlayStyles.margin,
            pointerEvents: 'none',
            position: 'fixed',
        });

        this.node.style.zIndex = '10000000';

        this.node.appendChild(this.border);
        this.border.appendChild(this.padding);
        this.padding.appendChild(this.content);
        container.appendChild(this.node);
    }

    remove() {
        if (this.node.parentNode) {
            this.node.parentNode.removeChild(this.node);
        }
    }

    update(box, dims) {
        boxWrap(dims, 'margin', this.node);
        boxWrap(dims, 'border', this.border);
        boxWrap(dims, 'padding', this.padding);

        Object.assign(this.content.style, {
            height: box.height - dims.borderTop - dims.borderBottom - dims.paddingTop - dims.paddingBottom + 'px',
            width: box.width - dims.borderLeft - dims.borderRight - dims.paddingLeft - dims.paddingRight + 'px',
        });

        Object.assign(this.node.style, {
            top: box.top - dims.marginTop + 'px',
            left: box.left - dims.marginLeft + 'px',
        });
    }
}

class OverlayTip {
    constructor(doc, container) {
        this.tip = doc.createElement('div');
        Object.assign(this.tip.style, {
            display: 'flex',
            flexFlow: 'row nowrap',
            backgroundColor: '#333740',
            borderRadius: '2px',
            fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace',
            fontWeight: 'bold',
            padding: '3px 5px',
            pointerEvents: 'none',
            position: 'fixed',
            fontSize: '12px',
            whiteSpace: 'nowrap',
        });

        this.nameSpan = doc.createElement('span');
        this.tip.appendChild(this.nameSpan);
        Object.assign(this.nameSpan.style, {
            color: '#ee78e6',
        });
        this.dimSpan = doc.createElement('span');
        this.tip.appendChild(this.dimSpan);
        Object.assign(this.dimSpan.style, {
            color: '#d7d7d7',
        });

        this.tip.style.zIndex = '10000000';
        container.appendChild(this.tip);
    }

    remove() {
        if (this.tip.parentNode) {
            this.tip.parentNode.removeChild(this.tip);
        }
    }

    updateText(name, dim) {
        this.nameSpan.textContent = name;
        this.dimSpan.textContent = dim;

        if (dim) {
            Object.assign(this.nameSpan.style, {
                borderRight: '1px solid #aaaaaa',
                paddingRight: '0.5rem',
                marginRight: '0.5rem',
            });
            Object.assign(this.dimSpan.style, {
                display: 'inline',
            });
        } else {
            Object.assign(this.nameSpan.style, {
                borderRight: 'none',
                paddingRight: '0',
                marginRight: '0',
            });
            Object.assign(this.dimSpan.style, {
                display: 'none',
            });
        }
    }

    updatePosition(dims, bounds) {
        const tipRect = this.tip.getBoundingClientRect();
        const tipPos = findTipPos(dims, bounds, {
            width: tipRect.width,
            height: tipRect.height,
        });
        Object.assign(this.tip.style, tipPos.style);
    }
}

export default class Overlay {
    constructor() {
        // Find the root window, because overlays are positioned relative to it.
        const currentWindow = window.__APP_ACTIONS_TARGET_WINDOW__ || window;
        this.window = currentWindow;

        // When opened in shells/dev, the tooltip should be bound by the app iframe, not by the topmost window.
        const tipBoundsWindow = window.__APP_ACTIONS_TARGET_WINDOW__ || window;
        this.tipBoundsWindow = tipBoundsWindow;

        const doc = currentWindow.document;
        this.container = doc.createElement('div');
        this.container.style.zIndex = '10000000';

        this.tip = new OverlayTip(doc, this.container);
        this.rects = [];

        doc.body.appendChild(this.container);
    }

    remove() {
        this.tip.remove();
        this.rects.forEach(rect => {
            rect.remove();
        });
        this.rects.length = 0;
        if (this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }

    inspect(nodes, pattern, name) {
        // We can't get the size of text nodes or comment nodes. React as of v15
        // heavily uses comment nodes to delimit text.
        const elements = nodes.filter(node => node.nodeType === Node.ELEMENT_NODE);

        while (this.rects.length > elements.length) {
            const rect = this.rects.pop();
            rect.remove();
        }
        if (elements.length === 0) {
            return;
        }

        while (this.rects.length < elements.length) {
            this.rects.push(new OverlayRect(this.window.document, this.container));
        }

        const outerBox = {
            top: Number.POSITIVE_INFINITY,
            right: Number.NEGATIVE_INFINITY,
            bottom: Number.NEGATIVE_INFINITY,
            left: Number.POSITIVE_INFINITY,
        };
        elements.forEach((element, index) => {
            const box = getNestedBoundingClientRect(element, this.window);
            const dims = getElementDimensions(element);

            outerBox.top = Math.min(outerBox.top, box.top - dims.marginTop);
            outerBox.right = Math.max(outerBox.right, box.left + box.width + dims.marginRight);
            outerBox.bottom = Math.max(outerBox.bottom, box.top + box.height + dims.marginBottom);
            outerBox.left = Math.min(outerBox.left, box.left - dims.marginLeft);

            const rect = this.rects[index];
            rect.update(box, dims);
        });

        this.tip.updateText(pattern, name);
        const tipBounds = getNestedBoundingClientRect(this.tipBoundsWindow.document.documentElement, this.window);

        this.tip.updatePosition(
            {
                top: outerBox.top,
                left: outerBox.left,
                height: outerBox.bottom - outerBox.top,
                width: outerBox.right - outerBox.left,
            },
            {
                top: tipBounds.top + this.tipBoundsWindow.scrollY,
                left: tipBounds.left + this.tipBoundsWindow.scrollX,
                height: this.tipBoundsWindow.innerHeight,
                width: this.tipBoundsWindow.innerWidth,
            },
        );
    }
}

function findTipPos(dims, bounds, tipSize) {
    const tipHeight = Math.max(tipSize.height, 20);
    const tipWidth = Math.max(tipSize.width, 60);
    const margin = 5;

    let top;
    if (dims.top + dims.height + tipHeight <= bounds.top + bounds.height) {
        if (dims.top + dims.height < bounds.top + 0) {
            top = bounds.top + margin;
        } else {
            top = dims.top + dims.height + margin;
        }
    } else if (dims.top - tipHeight <= bounds.top + bounds.height) {
        if (dims.top - tipHeight - margin < bounds.top + margin) {
            top = bounds.top + margin;
        } else {
            top = dims.top - tipHeight - margin;
        }
    } else {
        top = bounds.top + bounds.height - tipHeight - margin;
    }

    let left = dims.left + margin;
    if (dims.left < bounds.left) {
        left = bounds.left + margin;
    }
    if (dims.left + tipWidth > bounds.left + bounds.width) {
        left = bounds.left + bounds.width - tipWidth - margin;
    }

    top += 'px';
    left += 'px';
    return {
        style: { top, left },
    };
}

function boxWrap(dims, what, node) {
    Object.assign(node.style, {
        borderTopWidth: dims[what + 'Top'] + 'px',
        borderLeftWidth: dims[what + 'Left'] + 'px',
        borderRightWidth: dims[what + 'Right'] + 'px',
        borderBottomWidth: dims[what + 'Bottom'] + 'px',
        borderStyle: 'solid',
    });
}

const overlayStyles = {
    background: 'rgba(120, 170, 210, 0.7)',
    padding: 'rgba(77, 200, 0, 0.3)',
    margin: 'rgba(255, 155, 0, 0.3)',
    border: 'rgba(255, 200, 50, 0.3)',
};

// Get the window object for the document that a node belongs to,
// or return null if it cannot be found (node not attached to DOM,
// etc).
function getOwnerWindow(node) {
    if (!node.ownerDocument) {
        return null;
    }
    return node.ownerDocument.defaultView;
}

// Get the iframe containing a node, or return null if it cannot
// be found (node not within iframe, etc).
function getOwnerIframe(node) {
    const nodeWindow = getOwnerWindow(node);
    if (nodeWindow) {
        return nodeWindow.frameElement;
    }
    return null;
}

// Get a bounding client rect for a node, with an
// offset added to compensate for its border.
function getBoundingClientRectWithBorderOffset(node) {
    const dimensions = getElementDimensions(node);
    return mergeRectOffsets([
        node.getBoundingClientRect(),
        {
            top: dimensions.borderTop,
            left: dimensions.borderLeft,
            bottom: dimensions.borderBottom,
            right: dimensions.borderRight,
            // This width and height won't get used by mergeRectOffsets (since this
            // is not the first rect in the array), but we set them so that this
            // object type checks as a ClientRect.
            width: 0,
            height: 0,
        },
    ]);
}

// Add together the top, left, bottom, and right properties of
// each ClientRect, but keep the width and height of the first one.
function mergeRectOffsets(rects) {
    return rects.reduce((previousRect, rect) => {
        if (previousRect == null) {
            return rect;
        }

        return {
            top: previousRect.top + rect.top,
            left: previousRect.left + rect.left,
            width: previousRect.width,
            height: previousRect.height,
            bottom: previousRect.bottom + rect.bottom,
            right: previousRect.right + rect.right,
        };
    });
}

// Calculate a boundingClientRect for a node relative to boundaryWindow,
// taking into account any offsets caused by intermediate iframes.
function getNestedBoundingClientRect(node, boundaryWindow) {
    const ownerIframe = getOwnerIframe(node);
    if (ownerIframe && ownerIframe !== boundaryWindow) {
        const rects = [node.getBoundingClientRect()];
        let currentIframe = ownerIframe;
        let onlyOneMore = false;
        while (currentIframe) {
            const rect = getBoundingClientRectWithBorderOffset(currentIframe);
            rects.push(rect);
            currentIframe = getOwnerIframe(currentIframe);

            if (onlyOneMore) {
                break;
            }
            // We don't want to calculate iframe offsets upwards beyond
            // the iframe containing the boundaryWindow, but we
            // need to calculate the offset relative to the boundaryWindow.
            if (currentIframe && getOwnerWindow(currentIframe) === boundaryWindow) {
                onlyOneMore = true;
            }
        }

        return mergeRectOffsets(rects);
    } else {
        return node.getBoundingClientRect();
    }
}

function getElementDimensions(domElement) {
    const calculatedStyle = window.getComputedStyle(domElement);
    return {
        borderLeft: parseInt(calculatedStyle.borderLeftWidth, 10),
        borderRight: parseInt(calculatedStyle.borderRightWidth, 10),
        borderTop: parseInt(calculatedStyle.borderTopWidth, 10),
        borderBottom: parseInt(calculatedStyle.borderBottomWidth, 10),
        marginLeft: parseInt(calculatedStyle.marginLeft, 10),
        marginRight: parseInt(calculatedStyle.marginRight, 10),
        marginTop: parseInt(calculatedStyle.marginTop, 10),
        marginBottom: parseInt(calculatedStyle.marginBottom, 10),
        paddingLeft: parseInt(calculatedStyle.paddingLeft, 10),
        paddingRight: parseInt(calculatedStyle.paddingRight, 10),
        paddingTop: parseInt(calculatedStyle.paddingTop, 10),
        paddingBottom: parseInt(calculatedStyle.paddingBottom, 10),
    };
}