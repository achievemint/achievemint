// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })

// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })

// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })

// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Add a custom command for mocking authentication
Cypress.Commands.add('mockAuthenticated', (username = 'TestUser') => {
  // Mock the session data
  cy.window().then((win) => {
    win.sessionStorage.setItem('next-auth.session-token', 'mock-token');
    
    // Mock the session state
    const mockSession = {
      user: { name: username },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
    
    win.sessionStorage.setItem('next-auth.session', JSON.stringify(mockSession));
  });
  
  // Reload the page to apply the session
  cy.reload();
});

// Add a command to clear authentication
Cypress.Commands.add('clearAuthentication', () => {
  cy.window().then((win) => {
    win.sessionStorage.removeItem('next-auth.session-token');
    win.sessionStorage.removeItem('next-auth.session');
  });
  
  // Reload the page to apply the changes
  cy.reload();
});