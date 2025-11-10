describe('Saucedemo - Navigation Tests', () => {
  let testData;

  before(() => {
    cy.fixture('example').then((data) => {
      testData = data;
    });
  });

  beforeEach(() => {
    cy.saucedemoLogin(testData.users.standard.username, testData.users.standard.password);
  });

  it('should open and close burger menu', () => {
    cy.get('#react-burger-menu-btn').click();
    cy.get('.bm-menu').should('be.visible');
    cy.get('.bm-menu-wrap').should('have.attr', 'aria-hidden', 'false');

    cy.get('#react-burger-cross-btn').click();
    cy.get('.bm-menu-wrap').should('have.attr', 'aria-hidden', 'true');
  });

  it('should navigate to all items from menu', () => {
    cy.get('#react-burger-menu-btn').click();
    cy.get('#inventory_sidebar_link').click();

    cy.url().should('include', '/inventory.html');
  });

  it('should navigate to about page', () => {
    cy.get('#react-burger-menu-btn').click();
    cy.get('#about_sidebar_link').should('have.attr', 'href', 'https://saucelabs.com/');
  });

  it('should logout successfully', () => {
    cy.saucedemoLogout();

    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.get('[data-test="login-button"]').should('be.visible');
  });

  it('should reset app state', () => {
    cy.addToCart(testData.products[0].name);
    cy.addToCart(testData.products[1].name);
    cy.verifyCartCount(2);

    cy.get('#react-burger-menu-btn').click();
    cy.get('#reset_sidebar_link').click();

    cy.verifyCartCount(0);
  });

  it('should display social media links in footer', () => {
    cy.get('.social_twitter').should('be.visible');
    cy.get('.social_facebook').should('be.visible');
    cy.get('.social_linkedin').should('be.visible');
  });

  it('should display footer text', () => {
    cy.get('.footer_copy').should('be.visible').and('contain', 'Sauce Labs');
  });

  it('should maintain navigation across different pages', () => {
    cy.addToCart(testData.products[0].name);
    cy.goToCart();

    cy.get('#react-burger-menu-btn').should('be.visible');
    cy.get('.shopping_cart_link').should('be.visible');
  });
});
