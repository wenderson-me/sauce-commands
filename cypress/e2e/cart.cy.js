describe('Saucedemo - Shopping Cart Tests', () => {
  let testData;

  before(() => {
    cy.fixture('example').then((data) => {
      testData = data;
    });
  });

  beforeEach(() => {
    cy.saucedemoLogin(testData.users.standard.username, testData.users.standard.password);
  });

  it('should add product to cart', () => {
    cy.verifyCartCount(0);
    cy.addToCart(testData.products[0].name);
    cy.verifyCartCount(1);
  });

  it('should add multiple products to cart', () => {
    cy.verifyCartCount(0);
    cy.addToCart(testData.products[0].name);
    cy.addToCart(testData.products[1].name);
    cy.addToCart(testData.products[2].name);
    cy.verifyCartCount(3);
  });

  it('should remove product from cart', () => {
    cy.addToCart(testData.products[0].name);
    cy.verifyCartCount(1);
    cy.removeFromCart(testData.products[0].name);
    cy.verifyCartCount(0);
  });

  it('should navigate to cart page', () => {
    cy.addToCart(testData.products[0].name);
    cy.goToCart();

    cy.get('.cart_item').should('have.length', 1);
    cy.contains('.cart_item', testData.products[0].name).should('be.visible');
  });

  it('should display correct product information in cart', () => {
    cy.addToCart(testData.products[0].name);
    cy.goToCart();

    cy.contains('.cart_item', testData.products[0].name)
      .within(() => {
        cy.get('.inventory_item_name').should('contain', testData.products[0].name);
        cy.get('.inventory_item_price').should('contain', testData.products[0].price);
      });
  });

  it('should remove product from cart page', () => {
    cy.addToCart(testData.products[0].name);
    cy.goToCart();

    cy.get('.cart_item').should('have.length', 1);
    cy.get('[data-test^="remove"]').click();
    cy.get('.cart_item').should('have.length', 0);
  });

  it('should continue shopping from cart', () => {
    cy.addToCart(testData.products[0].name);
    cy.goToCart();

    cy.get('[data-test="continue-shopping"]').click();
    cy.url().should('include', '/inventory.html');
  });

  it('should persist cart items across pages', () => {
    cy.addToCart(testData.products[0].name);
    cy.addToCart(testData.products[1].name);

    cy.verifyCartCount(2);

    cy.goToCart();
    cy.get('.cart_item').should('have.length', 2);
  });
});
