import React from 'react';
import KanbanBoard from './kaban-board';
import {Achievement} from '@/entities/Achievement';

describe('KanbanBoard Component', () => {
  const mockAchievements: Achievement[] = [
    {
      name: 'achievement1',
      description: 'First achievement',
      unlockDate: 0,
      unlocked: false,
      icon: '/images/icon1.png',
      iconGray: '/images/icon1_gray.png'
    },
    {
      name: 'achievement2',
      description: 'Second achievement',
      unlockDate: Date.now(),
      unlocked: true,
      icon: '/images/icon2.png',
      iconGray: '/images/icon2_gray.png'
    },
    {
      name: 'achievement3',
      description: 'Third achievement',
      unlockDate: 0,
      unlocked: false,
      icon: '/images/icon3.png',
      iconGray: '/images/icon3_gray.png'
    }
  ];

  const gameId = 'test-game-123';

  beforeEach(() => {
    cy.viewport(1920, 1080);

    // Clear localStorage before each test
    cy.clearLocalStorage();

    // Mock the useInProgress hook by setting up localStorage
    cy.window().then((win) => {
      win.localStorage.setItem(`kanban_${gameId}`, JSON.stringify(['achievement3']));
    });

    // Mount the component
    cy.mount(<KanbanBoard achievements={mockAchievements} gameId={gameId} />);
  });

  it('should render all three sections', () => {
    cy.contains('Locked Achievements').should('be.visible');
    cy.contains('In Progress').should('be.visible');
    cy.contains('Unlocked Achievements').should('be.visible');
  });

  it('should display achievements in the correct sections', () => {
    // Check Locked section
    cy.contains('Locked Achievements')
      .parent()
      .within(() => {
        cy.contains('First achievement').should('be.visible');
      });

    // Check In Progress section
    cy.contains('In Progress')
      .parent()
      .within(() => {
        cy.contains('Third achievement').should('be.visible');
      });

    // Check Unlocked section
    cy.contains('Unlocked Achievements')
      .parent()
      .within(() => {
        cy.contains('Second achievement').should('be.visible');
      });
  });

  it('should have the correct number of achievements in each section', () => {
    // Count achievements in Locked section
    cy.contains('Locked Achievements')
      .parent()
      .find('[data-testid="kanban-card"]')
      .should('have.length', 1);

    // Count achievements in In Progress section
    cy.contains('In Progress')
      .parent()
      .find('[data-testid="kanban-card"]')
      .should('have.length', 1);

    // Count achievements in Unlocked section
    cy.contains('Unlocked Achievements')
      .parent()
      .find('[data-testid="kanban-card"]')
      .should('have.length', 1);
  });
});
