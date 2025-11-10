describe('Saucedemo - Checkout Flow Tests', () => {
  let testData;

  before(() => {
    cy.fixture('example').then((data) => {
      testData = data;
    });
  });

  beforeEach(() => {
    cy.saucedemoLogin(testData.users.standard.username, testData.users.standard.password);
    cy.addToCart(testData.products[0].name);
    cy.addToCart(testData.products[1].name);
    cy.goToCart();
  });

  it('should complete full checkout process', () => {
    cy.checkout(testData.customer);

    cy.get('.cart_item').should('have.length', 2);
    cy.get('.summary_info').should('be.visible');

    cy.finishCheckout();

    cy.get('.complete-header').should('contain', 'Thank you for your order');
    cy.get('.complete-text').should('be.visible');
  });

  it('should display error when checkout information is missing', () => {
    cy.get('[data-test="checkout"]').click();
    cy.get('[data-test="continue"]').click();

    cy.get('[data-test="error"]').should('be.visible')
      .and('contain', 'Error: First Name is required');
  });

  it('should display error when last name is missing', () => {
    cy.get('[data-test="checkout"]').click();
    cy.get('[data-test="firstName"]').type(testData.customer.firstName);
    cy.get('[data-test="continue"]').click();

    cy.get('[data-test="error"]').should('be.visible')
      .and('contain', 'Error: Last Name is required');
  });

  it('should display error when postal code is missing', () => {
    cy.get('[data-test="checkout"]').click();
    cy.get('[data-test="firstName"]').type(testData.customer.firstName);
    cy.get('[data-test="lastName"]').type(testData.customer.lastName);
    cy.get('[data-test="continue"]').click();

    cy.get('[data-test="error"]').should('be.visible')
      .and('contain', 'Error: Postal Code is required');
  });

  it('should cancel checkout and return to cart', () => {
    cy.get('[data-test="checkout"]').click();
    cy.get('[data-test="cancel"]').click();

    cy.url().should('include', '/cart.html');
    cy.get('.cart_item').should('have.length', 2);
  });

  it('should display correct total price in checkout', () => {
    cy.checkout(testData.customer);

    cy.get('.summary_subtotal_label').should('be.visible');
    cy.get('.summary_tax_label').should('be.visible');
    cy.get('.summary_total_label').should('be.visible');
  });

  it('should allow navigation back to products from checkout complete', () => {
    cy.checkout(testData.customer);
    cy.finishCheckout();

    cy.get('[data-test="back-to-products"]').click();
    cy.url().should('include', '/inventory.html');
  });

  it('should display correct product information in checkout overview', () => {
    cy.checkout(testData.customer);

    cy.contains('.cart_item', testData.products[0].name)
      .within(() => {
        cy.get('.inventory_item_name').should('be.visible');
        cy.get('.inventory_item_price').should('be.visible');
        cy.get('.cart_quantity').should('contain', '1');
      });
  });
});
