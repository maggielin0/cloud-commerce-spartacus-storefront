import { LoaderState } from '../../state/utils/loader/loader-state';
import { CardType, PaymentDetails } from '../../model/cart.model';
import { Address, AddressValidation } from '../../model/address.model';
import { DeliveryMode, Order } from '../../model/order.model';

export const CHECKOUT_FEATURE = 'checkout';
export const CHECKOUT_DETAILS = '[Checkout] Checkout Details';

export interface StateWithCheckout {
  [CHECKOUT_FEATURE]: CheckoutState;
}

export interface AddressVerificationState {
  results: AddressValidation | string;
}

export interface CardTypesState {
  entities: { [code: string]: CardType };
}

export interface CheckoutStepsState {
  address: Address;
  deliveryMode: {
    supported: { [code: string]: DeliveryMode };
    selected: string;
  };
  paymentDetails: PaymentDetails;
  orderDetails: Order;
}

export interface CheckoutState {
  steps: LoaderState<CheckoutStepsState>;
  cardTypes: CardTypesState;
  addressVerification: AddressVerificationState;
}
