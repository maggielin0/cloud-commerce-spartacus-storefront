import { ProductReference } from '../../../model/product.model';
import * as fromActions from './../actions/product-references.action';
import * as fromReducer from './../reducers/product-references.reducer';

const productCode = 'productCode';
const product = {
  code: productCode,
  name: 'testProduct',
};

const list: ProductReference[] = [
  { referenceType: 'SIMILAR', target: product },
  { referenceType: 'ACCESSORIES', target: product },
];

describe('Product references reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromReducer;
      const action = {} as fromActions.ProductReferencesAction;
      const state = fromReducer.reducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('LOAD_PRODUCT_REFERENCES_SUCCESS', () => {
    it('should populate product references', () => {
      const { initialState } = fromReducer;
      const action = new fromActions.LoadProductReferencesSuccess({
        productCode,
        list,
      });
      const state = fromReducer.reducer(initialState, action);
      expect(state.productCode).toBe(productCode);
      expect(state.list).toBe(list);
    });
  });
});
