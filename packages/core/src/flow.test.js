import { preprocessFlows } from './flow';
import json2yaml from './json-to-yaml';

test('convert flow to cypress', () => {
    const json = {
        description: 'Test recorded at 5/1/2022, 6:35:47 PM',
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
                ],
                do: {
                    addCard: ['foo', 'bar', 'baz'],
                },
            },
            {
                with: 'Board',
                do: {
                    addLane: ['aaa'],
                },
            },
            {
                with: [
                    'Board',
                    {
                        Lane: 'aaa',
                    },
                ],
                do: {
                    addCard: ['fff'],
                },
                assert: 'exists',
            },
            {
                with: [
                    'Board',
                    {
                        Lane: 'aaa',
                    },
                ],
                do: {
                    addCard: [],
                },
                assert: {
                    exists: null,
                    text: ['===', 'aaa'],
                },
            },
        ],
    };

    const content = json2yaml(json);
    
    expect(content).toMatchInlineSnapshot(`
"description: \\"Test recorded at 5/1/2022, 6:35:47 PM\\"
start: 
  route: \\"/\\"
  auth: false
steps: 
  - with: 
      - Board
      - { Lane: Planned Tasks }
    do: 
      addCard: [foo, bar, baz]
  - with: Board
    do: 
      addLane: [aaa]
  - with: 
      - Board
      - { Lane: aaa }
    do: 
      addCard: [fff]
    assert: exists
  - with: 
      - Board
      - { Lane: aaa }
    do: 
      addCard: []
    assert: 
      exists: null
      text: [===, aaa]
"
`);

    expect(preprocessFlows(content, { fileName: 'main.yml' })).toMatchInlineSnapshot(`
"describe('main.yml', () => {
  it('Test recorded at 5/1/2022, 6:35:47 PM', () => {
    cy.visit('/');

    cy
      .with('Board')
      .with('Lane', 'Planned Tasks')
      .do('Lane', 'addCard', ['foo', 'bar', 'baz']);
    
    cy
      .with('Board')
      .do('Board', 'addLane', ['aaa']);
    
    cy
      .with('Board')
      .with('Lane', 'aaa')
      .do('Lane', 'addCard', ['fff'])
      .should('exists');
    
    cy
      .with('Board')
      .with('Lane', 'aaa')
      .do('Lane', 'addCard', [])
      .should('exists')
      .should('text', ['===', 'aaa']);
  });
});"
`);
});
