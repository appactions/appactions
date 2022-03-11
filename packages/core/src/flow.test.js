import preprocessFlows from './flow';

test('simple "do"', () => {
    const content = `
description: 'Test recorded at 1/7/2022, 7:35:19 PM'
start:
  route: '/'
  auth: false
steps:
  - with: Board
    do: click
`;
    expect(preprocessFlows(content, { fileName: 'main.yml' })).toMatchInlineSnapshot(`
"describe('main.yml', () => {
    it('Test recorded at 1/7/2022, 7:35:19 PM', () => {
        cy.visit('/');
        cy
        	.with('Board')
        	.do('Board', 'click');
        
    });
});"
`);
});

test('"do" after chain', () => {
    const content = `
description: 'Test recorded at 1/7/2022, 7:35:19 PM'
start:
  route: '/'
  auth: false
steps:
  - with: Board
  - with: { Lane: Planned Tasks, Button: /^Click to add card$/ }
    do: click
`;
    expect(preprocessFlows(content, { fileName: 'main.yml' })).toMatchInlineSnapshot(`
"describe('main.yml', () => {
    it('Test recorded at 1/7/2022, 7:35:19 PM', () => {
        cy.visit('/');
        cy
        	.with('Board');
        
        cy
        	.with('Lane', 'Planned Tasks')
        	.with('Button', /^Click to add card$/)
        	.do('Button', 'click');
        
    });
});"
`);
});

test('"do" with arguments', () => {
    const content = `
description: 'Test recorded at 1/7/2022, 7:35:19 PM'
start:
  route: '/'
  auth: false
steps:
  - with: Input
    do: { type: $data.user.email }
`;
    expect(preprocessFlows(content, { fileName: 'main.yml' })).toMatchInlineSnapshot(`
"describe('main.yml', () => {
    it('Test recorded at 1/7/2022, 7:35:19 PM', () => {
        cy.visit('/');
        cy
        	.with('Input')
        	.do('Input', 'type', ['$data.user.email']);
        
    });
});"
`);
});

test('"with" should correctly work when no name specified', () => {
    const content = `
description: 'Test recorded at 1/7/2022, 7:35:19 PM'
start:
  route: '/'
  auth: false
steps:
  - with: { NewCardForm, EditableLabel }
    do: { type: 'foobarbaz' }
`;
    expect(preprocessFlows(content, { fileName: 'main.yml' })).toMatchInlineSnapshot(`
"describe('main.yml', () => {
    it('Test recorded at 1/7/2022, 7:35:19 PM', () => {
        cy.visit('/');
        cy
        	.with('NewCardForm')
        	.with('EditableLabel')
        	.do('EditableLabel', 'type', ['foobarbaz']);
        
    });
});"
`);
});
