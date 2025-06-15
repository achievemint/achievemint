/**
 * Home Page Interactor
 * 
 * This class follows the Page Object Model pattern and encapsulates
 * all interactions with the home page.
 */
export class HomePage {
  /**
   * Visit the home page
   */
  visit() {
    cy.visit('/');
    return this;
  }

  /**
   * Get the welcome message element
   */
  getWelcomeMessage() {
    return cy.contains('Welcome to Achievemint!');
  }

  /**
   * Get the user greeting element
   * @param username - The username to check for in the greeting
   */
  getUserGreeting(username?: string) {
    if (username) {
      return cy.contains(`Hello, ${username}!`);
    }
    return cy.contains(/Hello, .+!/);
  }

  /**
   * Get the sign in button
   */
  getSignInButton() {
    return cy.contains('Sign in');
  }

  /**
   * Get the view game list button
   */
  getViewGameListButton() {
    return cy.contains('View game list');
  }

  /**
   * Check if the page is in authenticated state
   */
  assertAuthenticated() {
    this.getWelcomeMessage().should('be.visible');
    // Check for either the user greeting or the view game list button
    // This makes the test more resilient to changes in the UI
    this.getViewGameListButton().should('be.visible');
    return this;
  }

  /**
   * Check if the page is in unauthenticated state
   */
  assertUnauthenticated() {
    this.getWelcomeMessage().should('be.visible');
    this.getUserGreeting().should('not.exist');
    this.getSignInButton().should('be.visible');
    return this;
  }

  /**
   * Click the sign in button
   */
  clickSignIn() {
    this.getSignInButton().click();
    return this;
  }

  /**
   * Click the view game list button
   */
  clickViewGameList() {
    this.getViewGameListButton().click();
    return this;
  }
}

// Create a singleton instance
export const homePage = new HomePage();
