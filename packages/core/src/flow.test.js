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
      - { assert: exists }
  - with: Board
    do:
      - addLane: [New lane]
  - with:
      - Board
      - { Lane: New lane }
    do:
      - { assert: exists }
      - assert:
          exists: true
          text: New lane
`;

    expect(preprocessFlows(flow, { fileName: 'main.yml' })).toMatchInlineSnapshot(`
"describe('main.yml', () => {
  it('Test recorded at 5/1/2022, 6:35:47 PM', () => {
    cy.visit('/');

    const subject1 = cy
      .with('Board')
      .with('Lane', 'Planned Tasks');
    subject1
      .should('assert');
    
    const subject2 = cy
      .with('Board');
    subject2
      .do('Board', 'addLane', ['New lane']);
    
    const subject3 = cy
      .with('Board')
      .with('Lane', 'New lane');
    subject3
      .should('assert');
    subject3
      .should('assert');
    
  });
});"
`);
});
