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
                    addLane: 'aaa',
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
                    addCard: ['fff', 'ggg', 'hhh'],
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
                    addCard: ['bbb', 'nnn', 'mmm'],
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
      { addLane: aaa }
  - with: 
      - Board
      - { Lane: aaa }
    do: 
      addCard: [fff, ggg, hhh]
    assert: exists
  - with: 
      - Board
      - { Lane: aaa }
    do: 
      addCard: [bbb, nnn, mmm]
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
    	.do('TODO', 'addCard', ['foo', 'bar', 'baz']);
    
    cy
    	.with('Board')
    	.do('TODO', 'addLane', 'aaa');
    
    cy
    	.with('Board')
    	.with('Lane', 'aaa')
    	.do('TODO', 'addCard', ['fff', 'ggg', 'hhh'])
    	.should('exists');
    
    cy
    	.with('Board')
    	.with('Lane', 'aaa')
    	.do('TODO', 'addCard', ['bbb', 'nnn', 'mmm'])
    	.should('exists')
    	.should('text', ['===', 'aaa']);
  });
});"
`);
});
