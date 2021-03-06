import { login } from './auth-forms';
import { standardUser } from '../sample-data/shared-users';
import { generateMail, randomString } from './user';

export const PRODUCT_CODE_1 = '1934793';
export const PRODUCT_CODE_2 = '300938';
export const PRODUCT_CODE_3 = '3470545';
export const PRODUCT_CODE_4 = '29925';
export const PRODUCT_TYPE = 'camera';

function getCartItem(name: string) {
  return cy.get('cx-cart-item-list').contains('cx-cart-item', name);
}

export function addProductToCartViaAutoComplete() {
  cy.get('cx-searchbox input').type(PRODUCT_CODE_1);
  cy.get('.suggestions a').click();

  cy.get('cx-add-to-cart')
    .getByText(/Add To Cart/i)
    .click();
  cy.get('cx-added-to-cart-dialog [aria-label="Close"]').click();

  const miniCart = cy.get('cx-mini-cart');
  miniCart.within(() => {
    cy.get('.count').should('contain', 1);
  });
  miniCart.click();

  getCartItem('PowerShot A480').within(() => {
    cy.get('.cx-price>.cx-value').should('contain', '$99.85');
    cy.get('.cx-counter-value').should('have.value', '1');
    cy.get('.cx-total>.cx-value').should('contain', '$99.85');
  });
}

export function addProductToCartViaSearchPage() {
  cy.get('cx-searchbox input')
    .clear()
    .type(`${PRODUCT_TYPE}{enter}`);
  cy.get('cx-product-list')
    .contains('cx-product-list-item', 'Photosmart E317 Digital')
    .within(() => {
      cy.get('cx-add-to-cart')
        .getByText(/Add To Cart/i)
        .click();
    });

  cy.get('cx-added-to-cart-dialog [aria-label="Close"]').click();

  const miniCart = cy.get('cx-mini-cart');
  miniCart.within(() => {
    cy.get('.count').should('contain', 2);
  });
  miniCart.click();

  getCartItem('Photosmart E317 Digital Camera').within(() => {
    cy.get('.cx-price>.cx-value').should('contain', '$114.12');
    cy.get('.cx-counter-value').should('have.value', '1');
    cy.get('.cx-total>.cx-value').should('contain', '$114.12');
  });
}

export function removeAllItemsFromCart() {
  getCartItem('PowerShot A480').within(() => {
    cy.getByText('Remove').click();
  });

  cy.get('cx-cart-details .cx-total').should('contain', 'Cart total (1 item)');

  getCartItem('Photosmart E317 Digital Camera').within(() => {
    cy.getByText('Remove').click();
  });

  cy.get('.EmptyCartMiddleContent').should(
    'contain',
    'Your shopping cart is empty'
  );
}

export function loginRegisteredUser() {
  standardUser.registrationData.email = generateMail(randomString(), true);
  cy.requireLoggedIn(standardUser);
  cy.reload();
}

export function addProductWhenLoggedIn() {
  cy.get('cx-searchbox input').type(PRODUCT_CODE_2);
  cy.get('.suggestions a').click();
  cy.get('cx-add-to-cart')
    .getByText(/Add To Cart/i)
    .click();
  cy.get('cx-added-to-cart-dialog .cx-dialog-total').should(
    'contain',
    'Cart total (1 item)'
  );
  cy.get('cx-added-to-cart-dialog [aria-label="Close"]').click();
}

export function logOutAndNavigateToEmptyCart() {
  cy.selectUserMenuOption('Sign Out');
  cy.get('cx-login [role="link"]').should('contain', 'Sign In');

  cy.visit('/cart');
  cy.get('cx-breadcrumb h1').should('contain', 'Your Shopping Cart');
  cy.get('.EmptyCartMiddleContent').should(
    'contain',
    'Your shopping cart is empty'
  );
}

export function addProductAsAnonymous() {
  cy.get('cx-searchbox input').type(`${PRODUCT_CODE_3}{enter}`);
  cy.get('cx-product-list')
    .contains('cx-product-list-item', 'EASYSHARE M381')
    .within(() => {
      cy.get('cx-add-to-cart')
        .getByText(/Add To Cart/i)
        .click();
    });

  cy.get('cx-added-to-cart-dialog .cx-dialog-total').should(
    'contain',
    'Cart total (1 item)'
  );

  cy.get('cx-added-to-cart-dialog [aria-label="Close"]').click();
}

export function verifyMergedCartWhenLoggedIn() {
  cy.get('cx-login [role="link"]').click();
  login(
    standardUser.registrationData.email,
    standardUser.registrationData.password
  );

  cy.get('cx-breadcrumb h1').should('contain', '1 result');

  const miniCart = cy.get('cx-mini-cart');
  miniCart.within(() => {
    cy.get('.count').should('contain', 2);
  });
  miniCart.click();

  cy.get('cx-breadcrumb h1').should('contain', 'Your Shopping Cart');

  getCartItem('Photosmart E317 Digital Camera').within(() => {
    cy.get('.cx-counter-value').should('have.value', '1');
    cy.get('.cx-total>.cx-value').should('contain', '$114.12');
  });

  getCartItem('EASYSHARE M381').within(() => {
    cy.get('.cx-counter-value').should('have.value', '1');
    cy.get('.cx-total>.cx-value').should('contain', '$370.72');
  });
}

export function logOutAndEmptyCart() {
  cy.selectUserMenuOption('Sign Out');
  cy.visit('/cart');
  cy.get('cx-breadcrumb h1').should('contain', 'Your Shopping Cart');
  cy.get('.EmptyCartMiddleContent').should(
    'contain',
    'Your shopping cart is empty'
  );
}

export function manipulateCartQuantity() {
  cy.visit(`/product/${PRODUCT_CODE_2}`);
  cy.get('cx-add-to-cart')
    .getByText(/Add To Cart/i)
    .click();
  cy.get('cx-added-to-cart-dialog .cx-dialog-total').should(
    'contain',
    'Cart total (1 item)'
  );
  cy.get('cx-added-to-cart-dialog [aria-label="Close"]').click();

  const miniCart = cy.get('cx-mini-cart');
  miniCart.within(() => {
    cy.get('.count').should('contain', 1);
  });
  miniCart.click();

  getCartItem('Photosmart E317 Digital Camera').within(() => {
    cy.get('.cx-price>.cx-value').should('contain', '$114.12');
    cy.get('.cx-counter-value').should('have.value', '1');
    cy.get('.cx-total>.cx-value').should('contain', '$114.12');

    cy.get('.cx-counter-action')
      .contains('+')
      .click();
  });

  cy.get('cx-cart-details .cx-total').should('contain', 'Cart total (2 items)');

  cy.get('cx-order-summary')
    .contains('.cx-summary-row', 'Subtotal:')
    .get('.cx-summary-amount')
    .should('contain', '$208.24');

  getCartItem('Photosmart E317 Digital Camera').within(() => {
    cy.get('.cx-price>.cx-value').should('contain', '$114.12');
    cy.get('.cx-counter-value').should('have.value', '2');
    cy.get('.cx-total>.cx-value').should('contain', '$228.24');

    cy.get('.cx-counter-action')
      .contains('+')
      .click();
  });

  cy.get('cx-cart-details .cx-total').should('contain', 'Cart total (3 items)');

  cy.get('cx-order-summary')
    .contains('.cx-summary-row', 'Subtotal:')
    .get('.cx-summary-amount')
    .should('contain', '$322.36');

  getCartItem('Photosmart E317 Digital Camera').within(() => {
    cy.get('.cx-price>.cx-value').should('contain', '$114.12');
    cy.get('.cx-counter-value').should('have.value', '3');
    cy.get('.cx-total>.cx-value').should('contain', '$342.36');
  });
}

export function outOfStock() {
  cy.visit(`/product/${PRODUCT_CODE_4}`);

  cy.get('cx-product-summary .quantity').should('contain', 'Out of stock');
  cy.get('cx-product-summary cx-add-to-cart button').should('not.exist');
}
