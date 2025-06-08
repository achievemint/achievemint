import {homePage} from '../support/page-objects/home-page';
import {authFixture} from '../support/fixtures/auth-fixture';

describe('Home Page', () => {
    context('Unauthenticated User', () => {
        beforeEach(() => {
            authFixture.clearAuthentication();

            homePage.visit();
        });

        it('should display sign in button for unauthenticated users', () => {
            homePage
                .assertUnauthenticated()
                .getSignInButton()
                .should('be.visible');
        });

        it('should not display user greeting for unauthenticated users', () => {
            homePage.getUserGreeting().should('not.exist');
        });
    });

    context('Authenticated User', () => {
        beforeEach(() => {
            authFixture.clearAuthentication();
            authFixture.mockAuthenticationApi()
                .as('session');
            homePage.visit();
        });

        it('should display view game list button for authenticated users', () => {
            cy.wait('@session');
            homePage
                .assertAuthenticated()
                .getViewGameListButton()
                .should('be.visible');
        });

        it('should display user greeting with username for authenticated users', () => {
            homePage
                .getUserGreeting('QaGamer4000')
                .should('be.visible');
        });
    });
});
