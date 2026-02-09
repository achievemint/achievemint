import {homePage} from '../support/page-objects/home-page';
import {authFixture} from '../support/fixtures/auth-fixture';

describe('Home Page', () => {
    beforeEach(() => {
        authFixture.clearAuthentication();
    });

    context('Unauthenticated User', () => {
        beforeEach(() => {
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

        it('should not display game list card for unauthenticated users', () => {
            homePage.getGamesOwnedCard().should('not.exist');
        });

        it('should not display total playtime card for unauthenticated users', () => {
            homePage.getTotalPlaytimeCard().should('not.exist');
        });
    });

    context('Authenticated User', () => {
        beforeEach(() => {
            authFixture.mockAuthenticationApi()
                .as('session');

            cy.intercept('GET', '/api/games*', {
                body: {
                    gameCount: 42,
                    games: [
                        {appId: '1', title: 'Game 1', playTime: 600}, // 10 hrs
                        {appId: '2', title: 'Game 2', playTime: 300}  // 5 hrs
                    ]
                }
            }).as('getGames');

            homePage.visit();
        });

        it('should display view game list button for authenticated users', () => {
            homePage
                .assertAuthenticated()
                .getViewGameListButton()
                .should('be.visible');
        });

        it('should display user greeting with username for authenticated users', () => {
            homePage
                .getUserGreeting()
                .should('be.visible')
                .and('contain.text', 'QaGamer4000');
        });

        it('should not display sign in card for authenticated users', () => {
            homePage.getSignInButton().should('not.exist');
        });

        it('should display games owned card with value for authenticated users', () => {
            cy.wait('@getGames');
            homePage
                .getGamesOwnedCard()
                .should('be.visible')
                .parent()
                .find('#total-games')
                .and('contain.text', '42');
        });

        it('should display total playtime card with value for authenticated users', () => {
            cy.wait('@getGames');
            homePage
                .getTotalPlaytimeCard()
                .should('be.visible')
                .parent()
                .find('#total-playtime')
                .and('contain.text', '15 hrs');
        });

    });
});
