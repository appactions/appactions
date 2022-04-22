import json2yaml from './json-to-yaml';

// TODO get a good test case
test('YAML stringifier shold make good looking output', () => {
    const data = {
        description: 'Test recorded at 4/21/2022, 5:23:37 PM',
        start: {
            route: '/',
            auth: false,
        },
        steps: [
            {
                with: [
                    'Board',
                    {
                        Lane: 'Planned Tasks',
                    },
                    {
                        Button: 'Click to add card',
                    },
                ],
                do: 'click',
            },
            {
                with: [
                    'Board',
                    {
                        Lane: 'Planned Tasks',
                    },
                    'NewCardForm',
                    {
                        EditableLabel: 'title',
                    },
                ],
                do: 'keydown',
            },
            {
                with: [
                    'Board',
                    {
                        Lane: 'Planned Tasks',
                    },
                    'NewCardForm',
                    {
                        Button: 'Add card',
                    },
                ],
                do: {
                    add: ['s'],
                },
            },
            {
                with: {
                    Button: '+ Add another lane',
                },
                do: 'click',
            },
            {
                with: 'Board',
                do: 'keydown',
            },
            {
                with: 'Board',
                do: 'keydown',
            },
            {
                with: 'Board',
                do: 'change',
            },
            {
                with: [
                    'Board',
                    {
                        Button: 'Add lane',
                    },
                ],
                do: 'click',
            },
        ],
    };
    expect(json2yaml(data)).toMatchInlineSnapshot(`
"description: \\"Test recorded at 4/21/2022, 5:23:37 PM\\"
start: 
  route: \\"/\\"
  auth: false
steps: 
  - with: 
      - Board
      - Lane: \\"Planned Tasks\\"
      - Button: \\"Click to add card\\"
    do: click
  - with: 
      - Board
      - Lane: \\"Planned Tasks\\"
      - NewCardForm
      - EditableLabel: title
    do: keydown
  - with: 
      - Board
      - Lane: \\"Planned Tasks\\"
      - NewCardForm
      - Button: \\"Add card\\"
    do: { add: s }
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
      - Button: \\"Add lane\\"
    do: click
"
`);
});
