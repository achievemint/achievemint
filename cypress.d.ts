/// <reference types="cypress" />

// Extend the Cypress namespace to include custom commands

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select elements by data-test attribute
     * @param selector The value of the data-test attribute
     * @param args Options passed to cy.get command
     * @example cy.byDataTestId('submit-button')
     */
    byDataTestId(selector: string, args?: Parameters<typeof cy.get>[1]): Chainable;
  }
}
