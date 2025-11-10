describe('Saucedemo - Login Tests', () => {
  let testData;

  before(() => {
    cy.fixture('example').then((data) => {
      testData = data;
    });
  });

  beforeEach(() => {
    cy.visit('/');
  });

  it('should display login page correctly', () => {
    cy.get('[data-test="username"]').should('be.visible');
    cy.get('[data-test="password"]').should('be.visible');
    cy.get('[data-test="login-button"]').should('be.visible');
    cy.get('.login_logo').should('contain', 'Swag Labs');
  });

  it('should login successfully with standard user', () => {
    cy.get('[data-test="username"]').type(testData.users.standard.username);
    cy.get('[data-test="password"]').type(testData.users.standard.password);
    cy.get('[data-test="login-button"]').click();

    cy.url().should('include', '/inventory.html');
    cy.get('.title').should('contain', 'Products');
    cy.get('.inventory_item').should('have.length.greaterThan', 0);
  });

  it('should show error for locked out user', () => {
    cy.get('[data-test="username"]').type(testData.users.locked.username);
    cy.get('[data-test="password"]').type(testData.users.locked.password);
    cy.get('[data-test="login-button"]').click();

    cy.get('[data-test="error"]').should('be.visible')
      .and('contain', 'Epic sadface: Sorry, this user has been locked out');
  });

  it('should show error for invalid credentials', () => {
    cy.get('[data-test="username"]').type('invalid_user');
    cy.get('[data-test="password"]').type('wrong_password');
    cy.get('[data-test="login-button"]').click();

    cy.get('[data-test="error"]').should('be.visible')
      .and('contain', 'Epic sadface');
  });

  it('should show error when fields are empty', () => {
    cy.get('[data-test="login-button"]').click();

    cy.get('[data-test="error"]').should('be.visible')
      .and('contain', 'Username is required');
  });

  it('should use custom login command', () => {
    cy.saucedemoLogin(testData.users.standard.username, testData.users.standard.password);
    cy.get('.title').should('contain', 'Products');
  });
});
