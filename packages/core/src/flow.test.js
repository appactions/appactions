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
                    exists: true,
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
      exists: true
      text: [===, aaa]
"
`);

    expect(preprocessFlows(content, { fileName: 'main.yml' })).toMatchInlineSnapshot(`
"describe('main.yml', () => {
  it('Test recorded at 5/1/2022, 6:35:47 PM', () => {
    cy.visit('/');

    const subject1 = cy
      .with('Board')
      .with('Lane', 'Planned Tasks');
    subject1
      .do('Lane', 'addCard', ['foo', 'bar', 'baz']);
    
    
    const subject2 = cy
      .with('Board');
    subject2
      .do('Board', 'addLane', ['aaa']);
    
    
    const subject3 = cy
      .with('Board')
      .with('Lane', 'aaa');
    subject3
      .do('Lane', 'addCard', ['fff']);
    subject3
      .should('exists');
    
    const subject4 = cy
      .with('Board')
      .with('Lane', 'aaa');
    subject4
      .do('Lane', 'addCard', []);
    subject4
      .should('exists');
    subject4
      .do('Lane', 'text', ['TODO'])
      .should('toBe', 'aaa');
    
  });
});"
`);
});
