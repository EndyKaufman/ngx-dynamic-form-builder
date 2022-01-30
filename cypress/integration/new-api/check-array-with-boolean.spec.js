/// <reference types="cypress" />
describe('Check array with boolean', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    cy.wait(600);
  });

  it('add new boolean invalid value as string', () => {
    cy.get('.onLoadClick').click();
    cy.wait(600);

    cy.get('.Permissions-new > input').type('TRUE', { force: true });
    cy.get('.Permissions-new > button').click();
    cy.wait(600);

    cy.get('.Permissions > span').should(
      'have.text',
      ' each value in permissions must be a boolean value '
    );

    cy.get('form > p:nth-child(2) > span').should('have.text', '"INVALID"');
  });

  it('change valid value to invalid', () => {
    cy.get('.onLoadClick').click();
    cy.wait(600);

    cy.get('.Permissions > fieldset:nth-child(2) > input').type('TRUE', {
      force: true,
    });
    cy.wait(600);

    cy.get('.Permissions > span').should(
      'have.text',
      ' each value in permissions must be a boolean value '
    );

    cy.get('form > p:nth-child(2) > span').should('have.text', '"INVALID"');
  });

  it('add new boolean invalid value as string and after change it to correct boolean and save', () => {
    cy.get('.onLoadClick').click();
    cy.wait(600);
    cy.get('form > p:nth-child(2) > span').should('have.text', '"VALID"');

    cy.get('.Permissions-new > input').type('TRUE', { force: true });
    cy.get('.Permissions-new > button').click();
    cy.wait(600);

    cy.get('form > p:nth-child(2) > span').should('have.text', '"INVALID"');

    cy.get('.Permissions > span').should(
      'have.text',
      ' each value in permissions must be a boolean value '
    );

    cy.get('form > p:nth-child(2) > span').should('have.text', '"INVALID"');

    cy.get('.Permissions > fieldset:nth-child(4) > input').clear();
    cy.get('.Permissions > fieldset:nth-child(4) > input').type('false', {
      force: true,
    });
    cy.wait(600);

    cy.get('.Permissions > span').should(
      'have.text',
      ' each value in permissions must be a boolean value '
    );

    cy.get('form > p:nth-child(2) > span').should('have.text', '"INVALID"');

    cy.get(
      '.Permissions > fieldset:nth-child(4) > button:nth-child(3)'
    ).click();
    cy.wait(600);

    cy.get('.Permissions > span').should('not.exist');

    cy.get('form > p:nth-child(2) > span').should('have.text', '"VALID"');
  });
});
