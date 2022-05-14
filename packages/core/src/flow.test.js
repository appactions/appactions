import { preprocessFlows } from './flow';

test('convert flow to cypress', () => {
    const flow = `
description: "Test recorded at 5/1/2022, 6:35:47 PM"
start:
  route: /
  auth: false
steps:
  - with:
      - Board
      - { Lane: Planned Tasks }
    do:
      - exists: []
        assert: null
  - with: Board
    do:
      - addLane: [New lane]
  - with:
      - Board
      - { Lane: New lane }
    do:
      - exists: []
        assert: null
      - text: []
        assert: New lane
  - with: 
      - Board
      - { Lane: Planned Tasks }
      - { Card: Dispose Garbage }
      - Input
    do: 
      - exists: []
        assert: null
      - getValue: []
        assert: Dispose Garbage
`;

    expect(preprocessFlows(flow, { fileName: 'main.yml' })).toMatchInlineSnapshot(`
"describe('main.yml', () => {
  it('Test recorded at 5/1/2022, 6:35:47 PM', () => {
    cy.visit('/');

    const subject1 = cy
      .with('Board')
      .with('Lane', 'Planned Tasks');
    subject1
      .should('exist');
    
    const subject2 = cy
      .with('Board');
    subject2
      .do('Board', 'addLane', ['New lane'])
    
    
    const subject3 = cy
      .with('Board')
      .with('Lane', 'New lane');
    subject3
      .should('exist');
    subject3
      .do('Lane', 'text', [])
      .should('toBe', 'New lane');
    
    const subject4 = cy
      .with('Board')
      .with('Lane', 'Planned Tasks')
      .with('Card', 'Dispose Garbage')
      .with('Input');
    subject4
      .should('exist');
    subject4
      .do('Input', 'getValue', [])
      .should('toBe', 'Dispose Garbage');
    
  });
});"
`);
});
