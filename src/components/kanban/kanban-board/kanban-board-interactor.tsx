export class KanbanBoardInteractor {
    private dragAndDrop(xCoord: number) {
        cy.byDataTestId('draggable-card')
            .first()
            .then(([element]: Array<Element>) => {
                /*
                    The drag calculation is better if we account for the width of the element;
                    however, we have to determine if we're dragging left or right.
                 */
                const rect = element.getBoundingClientRect();
                const direction = rect.left < xCoord ? 1 : -1;

                cy.wrap(element)
                    .trigger('mousedown')
                    .trigger('mousemove', {
                        force: true,
                        clientX: xCoord + Math.floor(direction * rect.width / 2),
                    })
                    .trigger('mouseup');
            });
    }

    private getXCoordinates() {
        const width = window.innerWidth

        const inProgressSectionX = width / 2;
        const lockedSectionX = inProgressSectionX / 2;
        const unlockedSectionX = width - lockedSectionX;

        return {
            inProgressSectionX,
            lockedSectionX,
            unlockedSectionX
        };
    }

    public getAllSections() {
        return cy.byDataTestId('kanban-section');
    }

    public getLockedSection() {
        return this.getAllSections().eq(0);
    }

    public getInProgressSection() {
        return this.getAllSections().eq(1);
    }

    public getUnlockedSection() {
        return this.getAllSections().eq(2);
    }

    public assertSectionAndCardCount(expectedCount: number) {
        cy.byDataTestId('section-count')
            .should('contain', expectedCount)
            .byDataTestId('achievement-card')
            .should('have.length', expectedCount)

        return this;
    }

    public assertAchievementCard({index, name, desc}: {
        index: number,
        name: string,
        desc: string
    }) {
        cy.byDataTestId('achievement-card')
            .eq(index)
            .should('contain', name)
            .should('contain', desc);

        return this;
    }

    public dragCardFromLockedToInProgress() {
        const {inProgressSectionX} = this.getXCoordinates();

        this.getLockedSection()
            .within(() => {
                this.dragAndDrop(inProgressSectionX);
            });

        return this;
    }

    public dragCardFromUnlockedToInProgress() {
        const {inProgressSectionX} = this.getXCoordinates();

        this.getUnlockedSection()
            .within(() => {
                this.dragAndDrop(inProgressSectionX);
            })

        return this;
    }

    public dragCardFromUnlockedToLocked() {
        const {lockedSectionX} = this.getXCoordinates();

        this.getUnlockedSection()
            .within(() => {
                this.dragAndDrop(lockedSectionX);
            })

        return this;
    }

    public dragCardFromLockedToUnlocked() {
        const {unlockedSectionX} = this.getXCoordinates();

        this.getLockedSection()
            .within(() => {
                this.dragAndDrop(unlockedSectionX);
            })

        return this;
    }

}
