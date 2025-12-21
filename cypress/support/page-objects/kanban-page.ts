/**
 * Kanban Page Interactor
 *
 * This class follows the Page Object Model pattern and encapsulates
 * all interactions with the kanban page.
 */
export class KanbanPage {
    /**
     * Visit the kanban page for a specific game
     * @param appId - The Steam App ID of the game
     */
    visit(appId: string) {
        cy.visit(`/kanban/${appId}`);
        return this;
    }

    /**
     * Get the kanban sections
     */
    getSections() {
        return cy.byDataTestId('kanban-section');
    }

    /**
     * Get a specific section by its title
     * @param title - The title of the section
     */
    getSection(title: string) {
        return this.getSections().contains(title).parents('[data-test="kanban-section"]');
    }

    /**
     * Assert that the kanban board has all three standard sections
     */
    assertHasAllSections() {
        this.getSections().should('have.length', 3);
        cy.contains('Locked Achievements').should('be.visible');
        cy.contains('In Progress').should('be.visible');
        cy.contains('Unlocked Achievements').should('be.visible');
        return this;
    }
}

// Create a singleton instance
export const kanbanPage = new KanbanPage();
