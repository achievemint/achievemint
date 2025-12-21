/**
 * Games Page Interactor
 *
 * This class follows the Page Object Model pattern and encapsulates
 * all interactions with the games page.
 */
export class GamePage {
    /**
     * Visit the games page
     */
    visit() {
        cy.visit('/games');
        return this;
    }

    /**
     * Get the game cards
     */
    getGameCards() {
        return cy.get('a[href^="/kanban/"]');
    }

    /**
     * Get the game card by title
     * @param title - The title of the game
     */
    getGameCard(title: string) {
        return cy.contains(title);
    }

    /**
     * Assert that the game list is displayed with the expected number of games
     * @param count - Expected number of games
     */
    assertHasGames(count: number) {
        this.getGameCards().should('have.length', count);
        return this;
    }
}

// Create a singleton instance
export const gamePage = new GamePage();
