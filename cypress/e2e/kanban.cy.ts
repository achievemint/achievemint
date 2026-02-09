import {kanbanPage} from '../support/page-objects/kanban-page';
import {authFixture} from '../support/fixtures/auth-fixture';

describe('Kanban Board', () => {
    const appId = '123456';

    beforeEach(() => {
        authFixture.clearAuthentication();
    });

    context('Unauthenticated User', () => {
        it('should redirect to steam sign in when unauthenticated', () => {
            cy.intercept('GET', '**/api/auth/**').as('signIn');

            cy.visit(`/kanban/${appId}`, {failOnStatusCode: false});

            cy.wait('@signIn');
        });
    });

    context('Authenticated User', () => {
        beforeEach(() => {
            authFixture.mockAuthenticationApi().as('session');

            cy.intercept('GET', '/api/achievementData*', {
                body: {
                    achievements: [
                        {
                            name: 'ACH_1',
                            description: 'First Achievement',
                            unlocked: true,
                            unlockDate: Date.now(),
                            icon: '/icon1.png',
                            iconGray: '/icon1_gray.png'
                        },
                        {
                            name: 'ACH_2',
                            description: 'Second Achievement',
                            unlocked: false,
                            unlockDate: 0,
                            icon: '/icon2.png',
                            iconGray: '/icon2_gray.png'
                        }
                    ]
                }
            }).as('getAchievements');

            kanbanPage.visit(appId);
        });

        it('should display kanban board sections', () => {
            cy.wait('@session');
            cy.wait('@getAchievements');

            kanbanPage.assertHasAllSections();

            kanbanPage.getSection('Unlocked Achievements').should('contain', 'ACH_1');
            kanbanPage.getSection('Locked Achievements').should('contain', 'ACH_2');
        });
    });
});
