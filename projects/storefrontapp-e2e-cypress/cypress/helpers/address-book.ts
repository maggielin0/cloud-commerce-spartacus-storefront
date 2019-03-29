import { fillShippingAddress, ShippingAddressData } from './checkout-forms';

export const newAddress: ShippingAddressData = {
  firstName: 'Foo',
  lastName: 'Bar',
  phone: '1234567',
  address: {
    city: 'NS',
    country: 'Canada',
    line1: 'xxx1',
    line2: 'xxx2',
    postal: '21000',
    state: 'Quebec',
  },
};
export const editedAddress: ShippingAddressData = {
  ...newAddress,
  firstName: 'Baz',
  lastName: 'Qux',
};

export const assertAddressForm = (address: ShippingAddressData): void => {
  cy.get('cx-address-card .card-header').contains('✓ DEFAULT');
  cy.get('cx-address-card .card-body').within(_ => {
    cy.get('.cx-address-card__label--bold').contains(
      `${address.firstName} ${address.lastName}`
    );
    cy.get('.address_data > :nth-child(2)').contains(address.address.line1);
    cy.get('.address_data > :nth-child(3)').contains(address.address.line2);
    cy.get('.address_data > :nth-child(4)').contains(
      `${address.address.city}, CA-QC`
    );
    cy.get('.address_data > :nth-child(5)').contains(address.address.postal);
    cy.get('.address_data > :nth-child(6)').contains(address.phone);
  });
};

export function accessPageAsAnonymous() {
  cy.visit('/my-account/address-book');
  cy.location('pathname').should('contain', '/login');
}

export function displayAddressForm() {
  cy.get('cx-address-form').should('exist');
}

export function createNewAddress() {
  fillShippingAddress(newAddress);
}

export function verifyNewAddress() {
  cy.get('cx-address-card').should('have.length', 1);
  assertAddressForm(newAddress);
}

export function editAddress() {
  cy.get('.edit').click();
  cy.get('cx-address-form').within(() => {
    cy.get('[formcontrolname="titleCode"]').ngSelect('Mr.');
    cy.get('[formcontrolname="firstName"]')
      .clear()
      .type(editedAddress.firstName);
    cy.get('[formcontrolname="lastName"]')
      .clear()
      .type(editedAddress.lastName);
    cy.get('[formcontrolname="phone"]')
      .clear()
      .type(editedAddress.phone);

    cy.get('button.btn-primary').click();
  });
}

export function verifyEditedAddress() {
  cy.get('cx-address-card').should('have.length', 1);
  assertAddressForm(editedAddress);
}

export function addSecondAddress() {
  const secondAddress = {
    ...newAddress,
    firstName: 'N',
    lastName: 'Z',
  };
  cy.get('button')
    .contains(' Add new address ')
    .click();
  fillShippingAddress(secondAddress);
  cy.get('cx-address-card').should('have.length', 2);
}

export function setSecondAddressToDefault() {
  cy.get('.set-default').click();

  const firstCard = cy.get('cx-address-card').first();
  firstCard.should('contain', '✓ DEFAULT');
  firstCard.should('contain', 'N Z');
}

export function deleteExistingAddress() {
  let firstCard = cy.get('cx-address-card').first();

  firstCard.find('.delete').click();
  cy.get('.cx-address-card__delete-msg').should(
    'have.text',
    ' Are you sure you want to delete this address? '
  );

  // click cancel
  cy.get('.btn-secondary').should('contain', 'cancel');
  cy.get('.btn-secondary').click();
  cy.get('.cx-address-card__delete-msg').should(
    'not.contain',
    'Are you sure you want to delete this address?'
  );

  // click delete
  firstCard = cy.get('cx-address-card').first();
  firstCard.find('.delete').click();
  cy.get('.cx-address-card--delete-mode button.btn-primary').click();
  cy.get('cx-global-message').contains('Address deleted successfully!');

  cy.get('cx-address-card').should('have.length', 1);
}