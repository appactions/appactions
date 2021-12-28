// TODO would be nice if this function could assert for retryability (did it retry or not?)
export function expectToFailWithMessage(expectedMessage) {
    Cypress.once('fail', error => {
        if (error.message !== expectedMessage) {
            throw new Error(
                `Test expected to fail with a certain error, but instead it failed with:\n\n\t${error.message}\n\nThe expected error is:\n\n\t${expectedMessage}`,
            );
        }
    });

    // `expectedFailReason` should be at the end of the test logic
    cy.then(() => {
        throw new Error('This test expected to be failed at this point, but it didn\'t');
    });
}

export function disableMethod() {
    // TODO: parameters
    return () => () => {
        throw new Error('this method is disabled on this component');
    };
}
