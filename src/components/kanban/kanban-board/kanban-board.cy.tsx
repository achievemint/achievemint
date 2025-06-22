import React from 'react';
import {Achievement} from '@/entities/Achievement';
import {KanbanBoardInteractor} from "@/components/kanban/kanban-board/kanban-board-interactor";
import KanbanBoard from "@/components/kanban/kanban-board/kanban-board";

describe('KanbanBoard Component', () => {
    const mockAchievements: Achievement[] = [
        // Locked achievements (2)
        {
            name: 'locked1',
            description: 'First locked achievement',
            unlockDate: 0,
            unlocked: false,
            icon: '/images/icon1.png',
            iconGray: '/images/icon1_gray.png'
        },
        {
            name: 'locked2',
            description: 'Second locked achievement',
            unlockDate: 0,
            unlocked: false,
            icon: '/images/icon2.png',
            iconGray: '/images/icon2_gray.png'
        },
        // In Progress achievements (3)
        {
            name: 'inprogress1',
            description: 'First in progress achievement',
            unlockDate: 0,
            unlocked: false,
            icon: '/images/icon3.png',
            iconGray: '/images/icon3_gray.png'
        },
        {
            name: 'inprogress2',
            description: 'Second in progress achievement',
            unlockDate: 0,
            unlocked: false,
            icon: '/images/icon4.png',
            iconGray: '/images/icon4_gray.png'
        },
        {
            name: 'inprogress3',
            description: 'Third in progress achievement',
            unlockDate: 0,
            unlocked: false,
            icon: '/images/icon5.png',
            iconGray: '/images/icon5_gray.png'
        },
        // Unlocked achievements (4)
        {
            name: 'unlocked1',
            description: 'First unlocked achievement',
            unlockDate: Date.now(),
            unlocked: true,
            icon: '/images/icon6.png',
            iconGray: '/images/icon6_gray.png'
        },
        {
            name: 'unlocked2',
            description: 'Second unlocked achievement',
            unlockDate: Date.now(),
            unlocked: true,
            icon: '/images/icon7.png',
            iconGray: '/images/icon7_gray.png'
        },
        {
            name: 'unlocked3',
            description: 'Third unlocked achievement',
            unlockDate: Date.now(),
            unlocked: true,
            icon: '/images/icon8.png',
            iconGray: '/images/icon8_gray.png'
        },
        {
            name: 'unlocked4',
            description: 'Fourth unlocked achievement',
            unlockDate: Date.now(),
            unlocked: true,
            icon: '/images/icon9.png',
            iconGray: '/images/icon9_gray.png'
        }
    ];

    const gameId = 'test-game-123';
    const interactor = new KanbanBoardInteractor();

    const mount = () => {
        cy.mount(<KanbanBoard achievements={mockAchievements} gameId={gameId}/>);
    }

    beforeEach(() => {
        cy.viewport(1920, 1080);

        // Clear localStorage before each test
        cy.clearLocalStorage();

        // Mock the useInProgress hook by setting up localStorage
        cy.window().then((win) => {
            win.localStorage.setItem(`kanban_${gameId}`, JSON.stringify(['inprogress1', 'inprogress2', 'inprogress3']));
        });

        mount();
    });

    it('Should have three sections', () => {
        interactor.getAllSections()
            .should('have.length', 3)
    })

    it('should render sections in order', () => {
        interactor.getAllSections()
            .first()
            .contains("Locked Achievements")
            .should("be.visible");

        interactor.getAllSections()
            .eq(1)
            .contains("In Progress")
            .should('be.visible');

        interactor.getAllSections()
            .last()
            .contains("Unlocked Achievements")
            .should("be.visible");
    });

    it('should display correct counts and content in each section', () => {
        interactor.getLockedSection().within(() => {
            interactor
                .assertSectionAndCardCount(2)
                .assertAchievementCard({
                    index: 0,
                    name: 'locked1',
                    desc: 'First locked achievement'
                })
                .assertAchievementCard({
                    index: 1,
                    name: 'locked2',
                    desc: 'Second locked achievement'
                })
        });

        interactor.getInProgressSection().within(() => {
            interactor
                .assertSectionAndCardCount(3)
                .assertAchievementCard({
                    index: 0,
                    name: 'inprogress1',
                    desc: 'First in progress achievement'
                })
                .assertAchievementCard({
                    index: 1,
                    name: 'inprogress2',
                    desc: 'Second in progress achievement'
                })
                .assertAchievementCard({
                    index: 2,
                    name: 'inprogress3',
                    desc: 'Third in progress achievement'
                })
        });

        interactor.getUnlockedSection().within(() => {
            interactor
                .assertSectionAndCardCount(4)
                .assertAchievementCard({
                    index: 0,
                    name: 'unlocked1',
                    desc: 'First unlocked achievement'
                })
                .assertAchievementCard({
                    index: 1,
                    name: 'unlocked2',
                    desc: 'Second unlocked achievement'
                })
                .assertAchievementCard({
                    index: 2,
                    name: 'unlocked3',
                    desc: 'Third unlocked achievement'
                })
                .assertAchievementCard({
                    index: 3,
                    name: 'unlocked4',
                    desc: 'Fourth unlocked achievement'
                })

        });
    });

    describe('Drag & Drop', () => {
        it('should be able to drag from locked to in progress', () => {
            interactor.dragCardFromLockedToInProgress();

            interactor.getLockedSection().within(() => {
                interactor.assertSectionAndCardCount(1);
            });

            interactor.getInProgressSection().within(() => {
                interactor.assertSectionAndCardCount(4)
            })
        });

        it('should be able to drag from unlocked to in progress', () => {
            interactor.dragCardFromUnlockedToInProgress();

            interactor.getUnlockedSection().within(() => {
                interactor.assertSectionAndCardCount(3);
            });

            interactor.getInProgressSection().within(() => {
                interactor.assertSectionAndCardCount(4)
            })
        });

        it('should not be able to drag from unlocked to locked or vice-versa', () => {
            interactor.dragCardFromUnlockedToLocked();
            interactor.dragCardFromLockedToUnlocked();

            interactor.getLockedSection().within(() => {
                interactor.assertSectionAndCardCount(2)
            })

            interactor.getInProgressSection().within(() => {
                interactor.assertSectionAndCardCount(3)
            });

            interactor.getUnlockedSection().within(() => {
                interactor.assertSectionAndCardCount(4);
            });
        });

        it('Should respect my changes on reload', () => {
            interactor.dragCardFromLockedToInProgress();
            interactor.dragCardFromUnlockedToInProgress();

            cy.log('And I leave and come back')
            cy.mount(<div>Loading.....</div>);
            mount()

            interactor.getLockedSection().within(() => {
                interactor.assertSectionAndCardCount(1);
            })

            interactor.getInProgressSection().within(() => {
                interactor.assertSectionAndCardCount(5);
            })

            interactor.getUnlockedSection().within(() => {
                interactor.assertSectionAndCardCount(3);
            })
        });
    });
});
