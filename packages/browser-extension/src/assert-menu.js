import ReactDOM from 'react-dom';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

let container = null;
document.addEventListener('contextmenu', event => {
    event.preventDefault();

    if (container) {
        return;
    }

    container = document.createElement('div');
    Object.assign(container.style, {
        zIndex: 10000000,
        position: 'absolute',
        top: 0,
        left: 0,
    });
    document.body.appendChild(container);
    
    ReactDOM.render(<AssertMenu />, container);
});

function cx(...args) {
    return args.filter(Boolean).join(' ');
}

function AssertMenu() {
    return (
        <DropdownMenu.Root open>
            <DropdownMenu.Trigger />
            <DropdownMenu.Content
                className={cx(
                    'z-40 w-56 min-w-max py-1 rounded-md shadow-sm outline-none',
                    'bg-white border border-gray-200',
                    'dark:bg-neutral-800 dark:border-gray-700',
                )}
                alignOffset={-5}
            >
                <DropdownMenu.Item
                    className={cx(
                        'flex items-center w-full px-3 h-8 flex-shrink-0 text-sm text-left cursor-base focus:outline-none',
                        'focus:bg-neutral-100',
                        'dark:focus:bg-neutral-700',
                    )}
                >
                    <span className="flex-1 mr-2">Fullscreen</span>
                </DropdownMenu.Item>
                <DropdownMenu.Item
                    className={cx(
                        'flex items-center w-full px-3 h-8 flex-shrink-0 text-sm text-left cursor-base focus:outline-none',
                        'focus:bg-neutral-100 dark:focus:bg-neutral-700',
                    )}
                >
                    <span className="flex-1 mr-2">Copy</span>
                </DropdownMenu.Item>
                <DropdownMenu.Item
                    className={cx(
                        'flex items-center w-full px-3 h-8 flex-shrink-0 text-sm text-left cursor-base focus:outline-none',
                        'focus:bg-neutral-100 dark:focus:bg-neutral-700',
                    )}
                >
                    <span className="flex-1 mr-2">Share</span>
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="h-px my-1 bg-neutral-200 dark:bg-neutral-700" />
                <DropdownMenu.Item
                    className={cx(
                        'flex items-center w-full px-3 h-8 flex-shrink-0 text-sm text-left cursor-base focus:outline-none',
                        'focus:bg-neutral-100 dark:focus:bg-neutral-700',
                    )}
                >
                    <span className="flex-1 mr-2">Due Date</span>
                </DropdownMenu.Item>

                <DropdownMenu.Root>
                    <DropdownMenu.TriggerItem
                        className={cx(
                            'flex items-center w-full px-3 h-8 flex-shrink-0 text-sm text-left cursor-base focus:outline-none',
                            'focus:bg-neutral-100 dark:focus:bg-neutral-700',
                        )}
                    >
                        <span className="flex-1 mr-2">Labels</span>
                    </DropdownMenu.TriggerItem>
                    <DropdownMenu.Content
                        className={cx(
                            'z-40 w-48 min-w-max py-1 rounded-md shadow-sm outline-none',
                            'bg-white border border-gray-200',
                            'dark:bg-neutral-800 dark:border-gray-700',
                        )}
                        sideOffset={5}
                        alignOffset={-5}
                    >
                        <DropdownMenu.Item
                            className={cx(
                                'flex items-center w-full px-3 h-8 flex-shrink-0 text-sm text-left cursor-base focus:outline-none',
                                'focus:bg-neutral-100 dark:focus:bg-neutral-700',
                            )}
                        >
                            <span className="w-2 h-2 mr-4 bg-red-500 rounded-full" />
                            Bug
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                            className={cx(
                                'flex items-center w-full px-3 h-8 flex-shrink-0 text-sm text-left cursor-base focus:outline-none',
                                'focus:bg-neutral-100 dark:focus:bg-neutral-700',
                            )}
                        >
                            <span className="w-2 h-2 mr-4 bg-purple-500 rounded-full" />
                            Feature
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                            className={cx(
                                'flex items-center w-full px-3 h-8 flex-shrink-0 text-sm text-left cursor-base focus:outline-none',
                                'focus:bg-neutral-100 dark:focus:bg-neutral-700',
                            )}
                        >
                            <span className="w-2 h-2 mr-4 bg-blue-500 rounded-full" />
                            Improvement
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
                <DropdownMenu.Item
                    className={cx(
                        'flex items-center w-full px-3 h-8 flex-shrink-0 text-sm text-left cursor-base focus:outline-none',
                        'focus:bg-neutral-100 dark:focus:bg-neutral-700',
                    )}
                >
                    <span className="flex-1 mr-2">Unsubscribe</span>
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
}
