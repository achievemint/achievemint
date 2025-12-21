import {gamePage} from '../support/page-objects/game-page';
import {authFixture} from '../support/fixtures/auth-fixture';

describe('Game List', () => {
    beforeEach(() => {
        authFixture.clearAuthentication();
    });

    context('Unauthenticated User', () => {
        it('should redirect to steam sign in when unauthenticated', () => {
            cy.intercept('GET', '**/api/auth/**').as('signIn');

            cy.visit('/games');

            cy.wait('@signIn');
        });
    });

    context('Authenticated User', () => {
        beforeEach(() => {
            authFixture.mockAuthenticationApi().as('session');

            cy.intercept('GET', '/api/games*', {
                body: {
                    games: [
                        {appId: '10', title: 'Counter-Strike 2', cover_img_url: '/images/cs2.jpg'},
                        {appId: '20', title: 'Team Fortress 2', cover_img_url: '/images/tf2.jpg'},
                        {appId: '30', title: 'Dota 2', cover_img_url: '/images/dota2.jpg'},
                    ]
                }
            }).as('getGames');

            gamePage.visit();
        });

        it('should display game list', () => {
            cy.wait('@session');
            cy.wait('@getGames');

            gamePage.assertHasGames(3);

            gamePage.getGameCard('Counter-Strike 2').should('be.visible');
            gamePage.getGameCard('Team Fortress 2').should('be.visible');
            gamePage.getGameCard('Dota 2').should('be.visible');
        });
    });
});