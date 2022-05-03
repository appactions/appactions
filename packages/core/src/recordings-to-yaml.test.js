import renderYAML from './recordings-to-yaml';

// TODO update this data, add assert and nesting examples
const recordings = [
    {
        pattern: 'Button',
        name: '',
        owners: [
            {
                pattern: 'Board',
                name: null,
            },
            {
                pattern: 'Lane',
                name: 'Planned Tasks',
            },
            {
                pattern: 'Button',
                name: 'Click to add card',
            },
        ],
        action: 'click',
        args: [],
        tagName: 'A',
        keyCode: null,
        href: null,
        coordinates: null,
        id: 162,
    },
    {
        pattern: 'EditableLabel',
        name: 'title',
        owners: [
            {
                pattern: 'Board',
                name: null,
            },
            {
                pattern: 'Lane',
                name: 'Planned Tasks',
            },
            {
                pattern: 'NewCardForm',
                name: null,
            },
            {
                pattern: 'EditableLabel',
                name: 'title',
            },
        ],
        action: 'keydown',
        args: [],
        tagName: 'DIV',
        keyCode: 83,
        href: null,
        coordinates: null,
        id: 148,
    },
    {
        pattern: 'Card',
        name: 'Add card',
        owners: [
            {
                pattern: 'Board',
                name: null,
            },
            {
                pattern: 'Lane',
                name: 'Planned Tasks',
            },
            {
                pattern: 'NewCardForm',
                name: null,
            },
            {
                pattern: 'Button',
                name: 'Add card',
            },
        ],
        action: 'add',
        args: ['s'],
        value: '',
        tagName: 'BUTTON',
        keyCode: null,
        href: null,
        coordinates: null,
        id: 193,
    },
    {
        pattern: 'Button',
        name: '+ Add another lane',
        owners: [
            {
                pattern: 'Button',
                name: '+ Add another lane',
            },
        ],
        action: 'click',
        args: [],
        value: '',
        tagName: 'BUTTON',
        keyCode: null,
        href: null,
        coordinates: null,
        id: 208,
    },
    {
        pattern: 'Board',
        name: null,
        owners: [
            {
                pattern: 'Board',
                name: null,
            },
        ],
        action: 'keydown',
        args: [],
        value: '',
        tagName: 'TEXTAREA',
        keyCode: 87,
        href: null,
        coordinates: null,
        id: 19,
    },
    {
        pattern: 'Board',
        name: null,
        owners: [
            {
                pattern: 'Board',
                name: null,
            },
        ],
        action: 'keydown',
        args: [],
        value: 'w',
        tagName: 'TEXTAREA',
        keyCode: 87,
        href: null,
        coordinates: null,
        id: 19,
    },
    {
        pattern: 'Board',
        name: null,
        owners: [
            {
                pattern: 'Board',
                name: null,
            },
        ],
        action: 'change',
        args: [],
        value: 'ww',
        tagName: 'TEXTAREA',
        keyCode: null,
        href: null,
        coordinates: null,
        id: 19,
    },
    {
        pattern: 'Button',
        name: 'Add lane',
        owners: [
            {
                pattern: 'Board',
                name: null,
            },
            {
                pattern: 'Button',
                name: 'Add lane',
            },
        ],
        action: 'click',
        args: [],
        value: '',
        tagName: 'BUTTON',
        keyCode: null,
        href: null,
        coordinates: null,
        id: 254,
    },
];

const meta = {
    description: 'Test recorded at 4/21/2022, 5:23:37 PM',
    start: {
        route: '/',
        auth: false,
    },
};

test('Recording to YAML', () => {
    expect(renderYAML(meta, recordings)).toMatchInlineSnapshot(`
"description: \\"Test recorded at 4/21/2022, 5:23:37 PM\\"
start: 
  route: \\"/\\"
  auth: false
steps: 
  - with: 
      - Board
      - { Lane: Planned Tasks }
      - { Button: Click to add card }
    do: click
  - with: 
      - Board
      - { Lane: Planned Tasks }
      - NewCardForm
      - { EditableLabel: title }
    do: keydown
  - with: 
      - Board
      - { Lane: Planned Tasks }
      - NewCardForm
      - { Button: Add card }
    do: 
      add: [s]
  - with: { Button: + Add another lane }
    do: click
  - with: Board
    do: keydown
  - with: Board
    do: keydown
  - with: Board
    do: change
  - with: 
      - Board
      - { Button: Add lane }
    do: click
"
`);
});
