import renderYAML from './recordings-to-yaml';

const recordings = [
    {
        owners: [
            {
                pattern: 'Board',
                name: null,
                simplify: [
                    {
                        pattern: 'Board',
                        action: 'addLane',
                        start: {
                            pattern: 'Button',
                            name: '+ Add another lane',
                            action: 'click',
                        },
                        end: {
                            pattern: 'Button',
                            name: 'Add lane',
                            action: 'click',
                        },
                    },
                ],
            },
            {
                pattern: 'Lane',
                name: 'Planned Tasks',
                simplify: [
                    {
                        pattern: 'Lane',
                        action: 'addCard',
                        start: {
                            pattern: 'Button',
                            name: 'Click to add card',
                            action: 'click',
                        },
                        end: {
                            pattern: 'Button',
                            name: 'Add card',
                            action: 'click',
                        },
                    },
                ],
            },
        ],
        payload: [
            {
                action: 'addCard',
                args: [null, null, null],
            },
            {
                type: 'assert',
                action: 'exists',
                value: '',
                args: ['TODO_ASSERT_ACTION_ARGS'],
            },
        ],
    },
    {
        id: 208,
        owners: [
            {
                pattern: 'Board',
                name: null,
                simplify: [
                    {
                        pattern: 'Board',
                        action: 'addLane',
                        start: {
                            pattern: 'Button',
                            name: '+ Add another lane',
                            action: 'click',
                        },
                        end: {
                            pattern: 'Button',
                            name: 'Add lane',
                            action: 'click',
                        },
                    },
                ],
            },
            {
                pattern: 'Button',
                name: '+ Add another lane',
                simplify: [],
            },
        ],
        payload: [
            {
                type: 'event',
                action: 'click',
                args: [],
            },
        ],
        depth: 1,
        nestingStart: true,
    },
    {
        owners: [
            {
                pattern: 'Board',
                name: null,
                simplify: [
                    {
                        pattern: 'Board',
                        action: 'addLane',
                        start: {
                            pattern: 'Button',
                            name: '+ Add another lane',
                            action: 'click',
                        },
                        end: {
                            pattern: 'Button',
                            name: 'Add lane',
                            action: 'click',
                        },
                    },
                ],
            },
            {
                pattern: 'Form',
                name: null,
                simplify: [],
            },
            {
                pattern: 'Input',
                name: null,
                simplify: [],
            },
        ],
        payload: [
            {
                type: 'event',
                action: 'type',
                args: ['w'],
            },
            {
                type: 'event',
                action: 'type',
                args: ['w'],
            },
            {
                type: 'event',
                action: 'type',
                args: ['w'],
            },
            {
                type: 'event',
                action: 'type',
                args: ['w'],
            },
        ],
    },
    {
        id: 254,
        owners: [
            {
                pattern: 'Board',
                name: null,
                simplify: [
                    {
                        pattern: 'Board',
                        action: 'addLane',
                        start: {
                            pattern: 'Button',
                            name: '+ Add another lane',
                            action: 'click',
                        },
                        end: {
                            pattern: 'Button',
                            name: 'Add lane',
                            action: 'click',
                        },
                    },
                ],
            },
        ],
        payload: [
            {
                type: 'event',
                action: 'click',
                args: [],
            },
        ],
        depth: 1,
        nestingEnd: true,
        simplify: {
            pattern: 'Board',
            action: 'addLane',
            start: {
                pattern: 'Button',
                name: '+ Add another lane',
                action: 'click',
            },
            end: {
                pattern: 'Button',
                name: 'Add lane',
                action: 'click',
            },
        },
    },
    {
        owners: [
            {
                pattern: 'Board',
                name: null,
                simplify: [
                    {
                        pattern: 'Board',
                        action: 'addLane',
                        start: {
                            pattern: 'Button',
                            name: '+ Add another lane',
                            action: 'click',
                        },
                        end: {
                            pattern: 'Button',
                            name: 'Add lane',
                            action: 'click',
                        },
                    },
                ],
            },
            {
                pattern: 'Lane',
                name: 'wwww',
                simplify: [
                    {
                        pattern: 'Lane',
                        action: 'addCard',
                        start: {
                            pattern: 'Button',
                            name: 'Click to add card',
                            action: 'click',
                        },
                        end: {
                            pattern: 'Button',
                            name: 'Add card',
                            action: 'click',
                        },
                    },
                ],
            },
        ],
        payload: [
            {
                type: 'assert',
                action: 'text',
                value: 'fff',
                args: ['TODO_ASSERT_ACTION_ARGS'],
            },
            {
                type: 'assert',
                action: 'exists',
                value: '',
                args: ['TODO_ASSERT_ACTION_ARGS'],
            },
            {
                type: 'event',
                action: 'click',
                args: [],
            },
        ],
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
    do: 
      - addCard: [, , ]
      - assert: 
          action: 
            exists: [TODO_ASSERT_ACTION_ARGS]
          value: \\"\\"
  - with: 
      - Board
      - { Button: + Add another lane }
    do: 
      - click: []
  - with: [Board, Form, Input]
    do: 
      - type: [w]
      - type: [w]
      - type: [w]
      - type: [w]
  - with: Board
    do: 
      - click: []
  - with: 
      - Board
      - { Lane: wwww }
    do: 
      - assert: 
          action: 
            text: [TODO_ASSERT_ACTION_ARGS]
          value: fff
      - assert: 
          action: 
            exists: [TODO_ASSERT_ACTION_ARGS]
          value: \\"\\"
      - click: []
"
`);
});
