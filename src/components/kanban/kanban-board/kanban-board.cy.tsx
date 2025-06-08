import React from 'react';
import KanbanBoard from './kanban-board';
import {Achievement} from '@/entities/Achievement';

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

  beforeEach(() => {
    cy.viewport(1920, 1080);

    // Clear localStorage before each test
    cy.clearLocalStorage();

    // Mock the useInProgress hook by setting up localStorage
    cy.window().then((win) => {
      win.localStorage.setItem(`kanban_${gameId}`, JSON.stringify(['inprogress1', 'inprogress2', 'inprogress3']));
    });

    // Mount the component
    cy.mount(<KanbanBoard achievements={mockAchievements} gameId={gameId} />);
  });

  it('should render all three sections in order', () => {
    cy.byDataTestId('kanban-section')
        .should('have.length', 3)
        .first()
        .contains("Locked Achievements")
        .should("be.visible");

    cy.byDataTestId('kanban-section')
        .eq(1)
        .contains("In Progress")
        .should('be.visible');

    cy.byDataTestId('kanban-section')
        .should('have.length', 3)
        .last()
        .contains("Unlocked Achievements")
        .should("be.visible");
  });

  it('should display correct counts and content in each section', () => {
    // Check Locked section
    cy.byDataTestId('kanban-section').first().within(() => {
      cy.byDataTestId('section-count').should('contain', '2');

      cy.byDataTestId('achievement-card').should('have.length', 2);

      cy.byDataTestId('achievement-card').first().should('contain', 'locked1');
      cy.byDataTestId('achievement-card').first().should('contain', 'First locked achievement');
      cy.byDataTestId('achievement-card').last().should('contain', 'locked2');
      cy.byDataTestId('achievement-card').last().should('contain', 'Second locked achievement');
    });

    // Check In Progress section
    cy.byDataTestId('kanban-section').eq(1).within(() => {
      cy.byDataTestId('section-count').should('contain', '3');

      cy.byDataTestId('achievement-card').should('have.length', 3);

      cy.byDataTestId('achievement-card').eq(0).should('contain', 'inprogress1');
      cy.byDataTestId('achievement-card').eq(0).should('contain', 'First in progress achievement');
      cy.byDataTestId('achievement-card').eq(1).should('contain', 'inprogress2');
      cy.byDataTestId('achievement-card').eq(1).should('contain', 'Second in progress achievement');
      cy.byDataTestId('achievement-card').eq(2).should('contain', 'inprogress3');
      cy.byDataTestId('achievement-card').eq(2).should('contain', 'Third in progress achievement');
    });

    // Check Unlocked section
    cy.byDataTestId('kanban-section').last().within(() => {
      cy.byDataTestId('section-count').should('contain', '4');

      cy.byDataTestId('achievement-card').should('have.length', 4);

      cy.byDataTestId('achievement-card').eq(0).should('contain', 'unlocked1');
      cy.byDataTestId('achievement-card').eq(0).should('contain', 'First unlocked achievement');
      cy.byDataTestId('achievement-card').eq(1).should('contain', 'unlocked2');
      cy.byDataTestId('achievement-card').eq(1).should('contain', 'Second unlocked achievement');
      cy.byDataTestId('achievement-card').eq(2).should('contain', 'unlocked3');
      cy.byDataTestId('achievement-card').eq(2).should('contain', 'Third unlocked achievement');
      cy.byDataTestId('achievement-card').eq(3).should('contain', 'unlocked4');
      cy.byDataTestId('achievement-card').eq(3).should('contain', 'Fourth unlocked achievement');
    });
  });
});
