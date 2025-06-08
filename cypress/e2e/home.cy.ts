import { homePage } from '../support/page-objects/home-page';

describe('Home Page', () => {
  context('Unauthenticated User', () => {
    beforeEach(() => {
      // Clear any existing authentication
      cy.clearAuthentication();
      
      // Visit the home page
      homePage.visit();
    });

    it('should display sign in button for unauthenticated users', () => {
      // Assert that the page is in unauthenticated state
      homePage.assertUnauthenticated();
      
      // Verify the sign in button is visible
      homePage.getSignInButton().should('be.visible');
    });

    it('should not display user greeting for unauthenticated users', () => {
      // Verify that the user greeting is not present
      homePage.getUserGreeting().should('not.exist');
    });
  });

  context('Authenticated User', () => {
    const testUsername = 'TestUser';
    
    beforeEach(() => {
      // Mock authentication
      cy.visit('/');
      cy.mockAuthenticated(testUsername);
    });

    it('should display view game list button for authenticated users', () => {
      // Assert that the page is in authenticated state
      homePage.assertAuthenticated();
      
      // Verify the view game list button is visible
      homePage.getViewGameListButton().should('be.visible');
    });

    it('should display user greeting with username for authenticated users', () => {
      // Verify that the user greeting contains the username
      homePage.getUserGreeting(testUsername).should('be.visible');
    });
  });
});