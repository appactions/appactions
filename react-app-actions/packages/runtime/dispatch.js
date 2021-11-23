import { computeAccessibleName as getHostSpecifier } from 'dom-accessibility-api';

export async function dispatch(renderer, command) {
    return retryable(() => {
        const roots = renderer.getFiberRoots();

        const matches = renderer.listFibersByPredicate(roots[0].current, fiber => {
            const normalized = normalize(renderer, fiber);
            if (normalized) {
                // console.info('visited:', normalized.displayName, normalized.role, JSON.stringify(normalized.specifier));

                if (command.with.role === normalized.role) {
                    if (command.with.specifier) {
                        // TODO add regex here
                        return command.with.specifier === normalized.specifier;
                    }

                    return true;
                }
            }

            return false;
        });

        if (matches.length === 0) {
            throw new Error(`No matches: ${command.with.role}`);
        }

        if (matches.length > 1) {
            throw new Error(`Too much matches: ${command.with.role}`);
        }

        const subjectFiber = matches[0];

        if (command.do) {
            if (command.do.method === 'click') {
                const els = renderer.findNativeNodes(subjectFiber);
                setTimeout(() => {
                    console.log('clicking...');
                    els[0].click();
                }, 5000);
            }
        }

        return true;
    });
}

async function retryable(fn, triesLeft = 20) {
    try {
        return await fn();
    } catch (e) {
        if (!triesLeft) {
            throw e;
        }
        await new Promise(res => setTimeout(res, 200));
        return retryable(fn, triesLeft - 1);
    }
}

function normalize(renderer, fiber) {
    const displayName = renderer.getDisplayName(fiber);
    if (hasAppAction(fiber)) {
        const role = getRole(fiber);
        if (role) {
            return {
                displayName,
                role,
                specifier: getSpecifier(fiber),
            };
        }
    } else if (fiber.stateNode instanceof Element) {
        const role = getHostRole(fiber.stateNode);
        if (role) {
            return {
                displayName,
                role,
                specifier: getHostSpecifier(fiber.stateNode) || null,
            };
        }
    }

    return null;
}

function hasAppAction(fiber) {
    return Boolean(fiber.type && fiber.type.__REACT_APP_ACTIONS__);
}

function getRole(fiber) {
    return fiber.type.__REACT_APP_ACTIONS__.roles.get(fiber.type);
}
function getSpecifier(fiber) {
    const drivers = fiber.type.__REACT_APP_ACTIONS__.drivers.get(fiber.type);
    if (drivers && drivers.getSpecifier) {
        return drivers.getSpecifier(fiber);
    }
    return null;
}

const hostRoles = [
    { element: 'menuitem', role: 'menuitem' },
    { element: 'rel', role: 'roletype' },
    { element: 'article', role: 'article' },
    { element: 'header', role: 'banner' },
    {
        element: 'input',
        role: 'button',
        attributes: [{ attributeName: 'aria-pressed' }, { attributeName: 'type', value: 'checkbox' }],
    },
    { element: 'summary', role: 'button', attributes: [{ attributeName: 'aria-expanded', value: 'false' }] },
    { element: 'summary', role: 'button', attributes: [{ attributeName: 'aria-expanded', value: 'true' }] },
    { element: 'input', role: 'button', attributes: [{ attributeName: 'type', value: 'button' }] },
    { element: 'input', role: 'button', attributes: [{ attributeName: 'type', value: 'image' }] },
    { element: 'input', role: 'button', attributes: [{ attributeName: 'type', value: 'reset' }] },
    { element: 'input', role: 'button', attributes: [{ attributeName: 'type', value: 'submit' }] },
    { element: 'button', role: 'button' },
    { element: 'td', role: 'cell' },
    { element: 'input', role: 'checkbox', attributes: [{ attributeName: 'type', value: 'checkbox' }] },
    { element: 'th', role: 'columnheader' },
    {
        element: 'input',
        role: 'combobox',
        attributes: [{ attributeName: 'list' }, { attributeName: 'type', value: 'email' }],
    },
    {
        element: 'input',
        role: 'combobox',
        attributes: [{ attributeName: 'list' }, { attributeName: 'type', value: 'search' }],
    },
    {
        element: 'input',
        role: 'combobox',
        attributes: [{ attributeName: 'list' }, { attributeName: 'type', value: 'tel' }],
    },
    {
        element: 'input',
        role: 'combobox',
        attributes: [{ attributeName: 'list' }, { attributeName: 'type', value: 'text' }],
    },
    {
        element: 'input',
        role: 'combobox',
        attributes: [{ attributeName: 'list' }, { attributeName: 'type', value: 'url' }],
    },
    {
        element: 'input',
        role: 'combobox',
        attributes: [{ attributeName: 'list' }, { attributeName: 'type', value: 'url' }],
    },
    {
        element: 'select',
        role: 'combobox',
        attributes: [
            { attributeName: 'multiple', shouldNotExist: true },
            { attributeName: 'size', shouldNotExist: true },
        ],
    },
    {
        element: 'select',
        role: 'combobox',
        attributes: [
            { attributeName: 'multiple', shouldNotExist: true },
            { attributeName: 'size', value: 1 },
        ],
    },
    { element: 'aside', role: 'complementary' },
    { element: 'footer', role: 'contentinfo' },
    { element: 'dd', role: 'definition' },
    { element: 'dialog', role: 'dialog' },
    { element: 'body', role: 'document' },
    { element: 'figure', role: 'figure' },
    { element: 'form', role: 'form', attributes: [{ attributeName: 'aria-label' }] },
    { element: 'form', role: 'form', attributes: [{ attributeName: 'aria-labelledby' }] },
    { element: 'form', role: 'form', attributes: [{ attributeName: 'name' }] },
    { element: 'span', role: 'generic' },
    { element: 'div', role: 'generic' },
    { element: 'table', role: 'grid', attributes: [{ attributeName: 'role', value: 'grid' }] },
    { element: 'td', role: 'gridcell', attributes: [{ attributeName: 'role', value: 'gridcell' }] },
    { element: 'details', role: 'group' },
    { element: 'fieldset', role: 'group' },
    { element: 'optgroup', role: 'group' },
    { element: 'h1', role: 'heading' },
    { element: 'h2', role: 'heading' },
    { element: 'h3', role: 'heading' },
    { element: 'h4', role: 'heading' },
    { element: 'h5', role: 'heading' },
    { element: 'h6', role: 'heading' },
    { element: 'img', role: 'img', attributes: [{ attributeName: 'alt' }] },
    { element: 'img', role: 'img', attributes: [{ attributeName: 'alt', shouldNotExist: true }] },
    { element: 'a', role: 'link', attributes: [{ attributeName: 'href' }] },
    { element: 'area', role: 'link', attributes: [{ attributeName: 'href' }] },
    { element: 'link', role: 'link', attributes: [{ attributeName: 'href' }] },
    { element: 'menu', role: 'list' },
    { element: 'ol', role: 'list' },
    { element: 'ul', role: 'list' },
    { element: 'select', role: 'listbox', attributes: [{ attributeName: 'size' }, { attributeName: 'multiple' }] },
    { element: 'select', role: 'listbox', attributes: [{ attributeName: 'size' }] },
    { element: 'select', role: 'listbox', attributes: [{ attributeName: 'multiple' }] },
    { element: 'datalist', role: 'listbox' },
    { element: 'li', role: 'listitem' },
    { element: 'main', role: 'main' },
    { element: 'math', role: 'math' },
    { element: 'menuitem', role: 'menuitem' },
    { element: 'nav', role: 'navigation' },
    { element: 'option', role: 'option' },
    { element: 'progress', role: 'progressbar' },
    { element: 'input', role: 'radio', attributes: [{ attributeName: 'type', value: 'radio' }] },
    { element: 'section', role: 'region', attributes: [{ attributeName: 'aria-label' }] },
    { element: 'section', role: 'region', attributes: [{ attributeName: 'aria-labelledby' }] },
    { element: 'frame', role: 'region' },
    { element: 'tr', role: 'row' },
    { element: 'tbody', role: 'rowgroup' },
    { element: 'tfoot', role: 'rowgroup' },
    { element: 'thead', role: 'rowgroup' },
    { element: 'th', role: 'rowheader', attributes: [{ attributeName: 'scope', value: 'row' }] },
    {
        element: 'input',
        role: 'searchbox',
        attributes: [
            { attributeName: 'list', shouldNotExist: true },
            { attributeName: 'type', value: 'search' },
        ],
    },
    { element: 'hr', role: 'separator' },
    { element: 'input', role: 'slider', attributes: [{ attributeName: 'type', value: 'range' }] },
    { element: 'input', role: 'spinbutton', attributes: [{ attributeName: 'type', value: 'number' }] },
    { element: 'output', role: 'status' },
    { element: 'table', role: 'table' },
    { element: 'dfn', role: 'term' },
    {
        element: 'input',
        role: 'textbox',
        attributes: [
            { attributeName: 'type', shouldNotExist: true },
            { attributeName: 'list', shouldNotExist: true },
        ],
    },
    {
        element: 'input',
        role: 'textbox',
        attributes: [
            { attributeName: 'list', shouldNotExist: true },
            { attributeName: 'type', value: 'email' },
        ],
    },
    {
        element: 'input',
        role: 'textbox',
        attributes: [
            { attributeName: 'list', shouldNotExist: true },
            { attributeName: 'type', value: 'tel' },
        ],
    },
    {
        element: 'input',
        role: 'textbox',
        attributes: [
            { attributeName: 'list', shouldNotExist: true },
            { attributeName: 'type', value: 'text' },
        ],
    },
    {
        element: 'input',
        role: 'textbox',
        attributes: [
            { attributeName: 'list', shouldNotExist: true },
            { attributeName: 'type', value: 'url' },
        ],
    },
    { element: 'textarea', role: 'textbox' },
];

export function getHostRole(element) {
    const tag = element.nodeName.toLowerCase();
    const match = hostRoles.find(role => {
        if (tag !== role.element) {
            return false;
        }

        if (role.attributes) {
            return role.attributes.every(({ attributeName, value, shouldNotExist }) => {
                const hasAttribute = element.hasAttribute(attributeName);

                if (shouldNotExist) {
                    if (hasAttribute) {
                        return false;
                    }
                } else if (value) {
                    if (element.getAttribute(attributeName) !== value) {
                        return false;
                    }
                } else if (!hasAttribute) {
                    return false;
                }

                return true;
            });
        }

        return true;
    });

    if (match) {
        // let's not handle generic roles (div and span) for now
        if (match.role === 'generic') {
            return null;
        }

        return match.role;
    }

    return null;
}
