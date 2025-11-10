describe('Saucedemo - Product Tests', () => {
  let testData;

  before(() => {
    cy.fixture('example').then((data) => {
      testData = data;
    });
  });

  beforeEach(() => {
    cy.saucedemoLogin(testData.users.standard.username, testData.users.standard.password);
  });

  it('should display all products on inventory page', () => {
    cy.get('.inventory_item').should('have.length', 6);
    cy.get('.inventory_item_name').should('have.length', 6);
    cy.get('.inventory_item_price').should('have.length', 6);
  });

  it('should sort products by name A to Z', () => {
    cy.get('.product_sort_container').select('Name (A to Z)');

    cy.get('.inventory_item_name').first()
      .should('contain', 'Sauce Labs Backpack');
  });

  it('should sort products by name Z to A', () => {
    cy.get('.product_sort_container').select('Name (Z to A)');

    cy.get('.inventory_item_name').first()
      .should('contain', 'Test.allTheThings()');
  });

  it('should sort products by price low to high', () => {
    cy.get('.product_sort_container').select('Price (low to high)');

    cy.get('.inventory_item_price').first()
      .should('contain', '$7.99');
  });

  it('should sort products by price high to low', () => {
    cy.get('.product_sort_container').select('Price (high to low)');

    cy.get('.inventory_item_price').first()
      .should('contain', '$49.99');
  });

  it('should navigate to product detail page', () => {
    cy.contains('.inventory_item_name', testData.products[0].name).click();

    cy.url().should('include', '/inventory-item.html');
    cy.get('.inventory_details_name').should('contain', testData.products[0].name);
    cy.get('.inventory_details_desc').should('be.visible');
    cy.get('.inventory_details_price').should('contain', testData.products[0].price);
  });

  it('should add product from detail page', () => {
    cy.contains('.inventory_item_name', testData.products[0].name).click();

    cy.get('[data-test^="add-to-cart"]').click();
    cy.verifyCartCount(1);
    cy.get('[data-test^="remove"]').should('be.visible');
  });

  it('should navigate back from product detail page', () => {
    cy.contains('.inventory_item_name', testData.products[0].name).click();
    cy.get('[data-test="back-to-products"]').click();

    cy.url().should('include', '/inventory.html');
  });

  it('should verify all product prices are displayed correctly', () => {
    testData.products.forEach((product) => {
      cy.verifyProductPrice(product.name, product.price);
    });
  });

  it('should display product images', () => {
    cy.get('.inventory_item img').should('have.length', 6);
    cy.get('.inventory_item img').each(($img) => {
      expect($img).to.have.attr('src');
    });
  });

  it('should show add to cart button for all products', () => {
    cy.get('[data-test^="add-to-cart"]').should('have.length', 6);
  });
});
