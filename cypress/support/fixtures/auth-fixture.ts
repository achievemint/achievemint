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
        return cy.clearAllSessionStorage()
            .clearAllCookies();
    }

    mockAuthenticationApi() {
        return cy.intercept('/api/auth/session', {fixture: 'api/auth/session/QaGamer4000.json', method: 'GET'})
    }
}

// Create a singleton instance
export const authFixture = new AuthFixture();
