/// <reference types="cypress" />

// Extend the Cypress namespace to include custom commands
declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to mock authenticated user session
     * @example cy.mockAuthenticated('TestUser')
     */
    mockAuthenticated(username?: string): Chainable<void>;

    /**
     * Custom command to clear authentication data
     * @example cy.clearAuthentication()
     */
    clearAuthentication(): Chainable<void>;
  }
}