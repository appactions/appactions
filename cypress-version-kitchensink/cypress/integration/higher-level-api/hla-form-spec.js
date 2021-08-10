import { Form, Input } from '../../support/high-level-api/testables';

describe('Integration test for Form', () => {
    beforeEach(() => {
        cy.visit('/integration-test/form');
    });

    it('Form.fill', () => {
        cy.with(Form).do(
            Form.fill({
                Name: 'Company',
                Description: 'Threat Intel Company',
                'Add to set': true,
                'Due date': '2018-11-13',
                'Due date time': '2018-11-05T06:08:00+00:00',
                // Cron: {
                //     parameters: {
                //         minute: '5',
                //         hour: '4',
                //         day_of_month: '*',
                //         day_of_week: '4',
                //         month_of_year: '*',
                //     },
                //     type: 'cron',
                // },
                Type: 'Animal',
                Types: ['Bar', 'Baz'],
                'Half-life override': 200,
                References: ['foo', 'bar', 'baz'],
                Wysiwyg: '<p>Hello <strong>user</strong>!</p>',
            }),
        );

        cy.window()
            .its('__formState')
            .should('deep.equal', {
                name: 'Company',
                add_to_set: true,
                types: [1, 2],
                references: ['foo', 'bar', 'baz'],
                description: 'Threat Intel Company',
                due_date: '2018-11-13',
                due_date_time: '2018-11-05T06:08:00+00:00',
                type: 'Animal',
                half_life_override: 200,
                wysiwyg: '<p>Hello <strong>user</strong>!</p>',
            });
    });
    it('Form.fill should not try fill disabled inputs', () => {
        cy.get('#submit-type-2').check();

        const data = {
            Name: 'Company',
            Description: 'Threat Intel Company',
            'Add to set': true,
            'Due date': '2018-11-13',
            'Due date time': '2018-11-05T06:08:00+00:00',
            // Cron: {
            //     parameters: {
            //         minute: '5',
            //         hour: '4',
            //         day_of_month: '*',
            //         day_of_week: '4',
            //         month_of_year: '*',
            //     },
            //     type: 'cron',
            // },
            Type: 'Animal',
            Types: ['Select all options'],
            // Types: ['Bar', 'Baz'],
            'Half-life override': 200,
            References: ['foo', 'bar', 'baz'],
            Wysiwyg: '<p>Hello <strong>user</strong>!</p>',
        };

        Object.entries(data).forEach(([label, value]) => {
            cy.with(Form).should($form => {
                const fillOnDisabled = () => Form.fill({ [label]: value })($form);

                expect(fillOnDisabled).to.throw(`Input with label "${label}" is disabled`);
            });
        });
    });
    it('Form.submit (no-dropdown)', () => {
        cy.with(Form)
            .do(Form.fill({ Name: 'Company' }))
            .do(Form.submit());

        cy.window()
            .its('__formEvent')
            .should('eq', 'handleSubmit');
    });
    it('Form.submit (cancel)', () => {
        cy.with(Form)
            .do(Form.fill({ Name: 'Company' }))
            .do(Form.submit('Cancel'));

        cy.window()
            .its('__formEvent')
            .should('eq', 'onCancel');
    });
    it('Form.submit (dropdown, normal submit)', () => {
        cy.get('#submit-type-1').check();
        cy.with(Form)
            .do(Form.fill({ Name: 'Company' }))
            .do(Form.submit());

        cy.window()
            .its('__formEvent')
            .should('eq', 'handleSubmit');
    });
    it('Form.submit (dropdown, submit from menu)', () => {
        cy.get('#submit-type-1').check();
        cy.with(Form)
            .do(Form.fill({ Name: 'Company' }))
            .do(Form.submit('Save and duplicate'));

        cy.window()
            .its('__formEvent')
            .should('eq', 'onSubmit SAVE_AND_DUPLICATE');
    });
    it('Form.fillAndSubmit', () => {
        cy.with(Form).do(Form.fillAndSubmit({ Name: 'Company' }));

        cy.window()
            .its('__formEvent')
            .should('eq', 'handleSubmit');
    });
});
