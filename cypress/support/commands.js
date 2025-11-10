/**
 * Login command for Saucedemo
 * @example cy.saucedemoLogin('standard_user', 'secret_sauce')
 * @param {string} username - Username (standard_user, locked_out_user, etc.)
 * @param {string} password - Password (secret_sauce)
 */
Cypress.Commands.add('saucedemoLogin', (username, password) => {
  cy.visit('/');
  cy.get('[data-test="username"]').type(username);
  cy.get('[data-test="password"]').type(password);
  cy.get('[data-test="login-button"]').click();
  cy.url().should('include', '/inventory.html');
});

/**
 * Add product to cart by name
 * @example cy.addToCart('Sauce Labs Backpack')
 * @param {string} productName - Name of the product
 */
Cypress.Commands.add('addToCart', (productName) => {
  cy.contains('.inventory_item', productName)
    .find('[data-test^="add-to-cart"]')
    .click();
});

/**
 * Remove product from cart by name
 * @example cy.removeFromCart('Sauce Labs Backpack')
 * @param {string} productName - Name of the product
 */
Cypress.Commands.add('removeFromCart', (productName) => {
  cy.contains('.inventory_item', productName)
    .find('[data-test^="remove"]')
    .click();
});

/**
 * Verify cart badge count
 * @example cy.verifyCartCount(3)
 * @param {number} count - Expected number of items in cart
 */
Cypress.Commands.add('verifyCartCount', (count) => {
  if (count === 0) {
    cy.get('.shopping_cart_badge').should('not.exist');
  } else {
    cy.get('.shopping_cart_badge').should('have.text', count.toString());
  }
});

/**
 * Navigate to cart page
 * @example cy.goToCart()
 */
Cypress.Commands.add('goToCart', () => {
  cy.get('.shopping_cart_link').click();
  cy.url().should('include', '/cart.html');
});

/**
 * Complete checkout process
 * @example cy.checkout({ firstName: 'John', lastName: 'Doe', zipCode: '12345' })
 * @param {object} customerInfo - Customer information
 */
Cypress.Commands.add('checkout', (customerInfo) => {
  cy.get('[data-test="checkout"]').click();
  cy.url().should('include', '/checkout-step-one.html');

  cy.get('[data-test="firstName"]').type(customerInfo.firstName);
  cy.get('[data-test="lastName"]').type(customerInfo.lastName);
  cy.get('[data-test="postalCode"]').type(customerInfo.zipCode);
  cy.get('[data-test="continue"]').click();

  cy.url().should('include', '/checkout-step-two.html');
});

/**
 * Finish checkout and verify order completion
 * @example cy.finishCheckout()
 */
Cypress.Commands.add('finishCheckout', () => {
  cy.get('[data-test="finish"]').click();
  cy.url().should('include', '/checkout-complete.html');
  cy.get('.complete-header').should('contain', 'Thank you for your order');
});

/**
 * Logout from Saucedemo
 * @example cy.saucedemoLogout()
 */
Cypress.Commands.add('saucedemoLogout', () => {
  cy.get('#react-burger-menu-btn').click();
  cy.get('#logout_sidebar_link').click();
  cy.url().should('eq', Cypress.config().baseUrl + '/');
});

/**
 * Sort products
 * @example cy.sortProducts('Price (low to high)')
 * @param {string} sortOption - Sort option text
 */
Cypress.Commands.add('sortProducts', (sortOption) => {
  cy.get('.product_sort_container').select(sortOption);
});

/**
 * Verify product price
 * @example cy.verifyProductPrice('Sauce Labs Backpack', '$29.99')
 * @param {string} productName - Name of the product
 * @param {string} expectedPrice - Expected price
 */
Cypress.Commands.add('verifyProductPrice', (productName, expectedPrice) => {
  cy.contains('.inventory_item', productName)
    .find('.inventory_item_price')
    .should('have.text', expectedPrice);
});

/**
 * Wait for element to be visible with custom timeout
 * @example cy.waitForElement('.my-element', 5000)
 * @param {string} selector - CSS selector
 * @param {number} timeout - Timeout in milliseconds
 */
Cypress.Commands.add('waitForElement', (selector, timeout = 10000) => {
  cy.get(selector, { timeout }).should('be.visible');
});
