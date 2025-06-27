export class KanbanBoardInteractor {
    public getAllSections() {
        return cy.byDataTestId('kanban-section')
    }

    public getLockedSection() {
        return this.getAllSections().eq(0)
    }

    public getInProgressSection() {
        return this.getAllSections().eq(1)
    }

    public getUnlockedSection() {
        return this.getAllSections().eq(2)
    }
}
