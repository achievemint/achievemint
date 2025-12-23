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

        it('should display search bar', () => {
            cy.wait('@session');
            cy.wait('@getGames');

            cy.get('input[placeholder="Search games..."]').should('be.visible');
        });

        it('should filter games when searching', () => {
            cy.wait('@session');
            cy.wait('@getGames');

            cy.get('input[placeholder="Search games..."]').type('Counter');

            gamePage.assertHasGames(1);
            gamePage.getGameCard('Counter-Strike 2').should('be.visible');
            gamePage.getGameCard('Team Fortress 2').should('not.exist');
            gamePage.getGameCard('Dota 2').should('not.exist');
        });

        it('should clear search when clicking clear button', () => {
            cy.wait('@session');
            cy.wait('@getGames');

            cy.get('input[placeholder="Search games..."]').type('Counter');
            gamePage.assertHasGames(1);

            cy.get('button[aria-label="Clear search"]').click();

            cy.get('input[placeholder="Search games..."]').should('have.value', '');
            gamePage.assertHasGames(3);
        });

        it('should update URL with search query', () => {
            cy.wait('@session');
            cy.wait('@getGames');

            cy.get('input[placeholder="Search games..."]').type('Dota');

            cy.url().should('include', 'search=Dota');
        });

        it('should initialize search from URL parameter', () => {
            cy.wait('@session');
            cy.wait('@getGames');

            cy.visit('/games?search=Team');

            cy.get('input[placeholder="Search games..."]').should('have.value', 'Team');
            gamePage.assertHasGames(1);
            gamePage.getGameCard('Team Fortress 2').should('be.visible');
        });
    });
});