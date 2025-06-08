/**
 * Authentication Fixture
 *
 * This fixture provides methods for mocking authentication in Cypress tests.
 */
export class AuthFixture {
    /**
     * Clear authentication data
     */
    clearAuthentication() {
        cy.window().then((win) => {
            win.sessionStorage.removeItem('next-auth.session-token');
            win.sessionStorage.removeItem('next-auth.session');
        });

        // Reload the page to apply the changes
        cy.reload();
    }

    mockAuthenticationApi() {
        return cy.intercept('/api/auth/session', {fixture: 'api/auth/session/QaGamer4000.json', method: 'GET'})
    }
}

// Create a singleton instance
export const authFixture = new AuthFixture();
