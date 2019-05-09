import { TestBed } from '@angular/core/testing';
import {
  CmsProductReferencesComponent,
  ProductReferenceService,
  RoutingService,
  UIProductReference,
} from '@spartacus/core';
import { Observable, of } from 'rxjs';
import { CmsComponentData } from '../../../../cms-structure/page/model/cms-component-data';
import { ProductReferencesService } from './product-references.component.service';

const productCode = 'productCode';
const product = {
  code: productCode,
  name: 'testProduct',
};

const title = 'mockTitle';

const list: UIProductReference[] = [
  { referenceType: 'SIMILAR', target: product },
  { referenceType: 'ACCESSORIES', target: product },
];

const router = {
  state: {
    url: '/',
    queryParams: {},
    params: { productCode },
  },
};

class MockRoutingService {
  getRouterState(): Observable<any> {
    return of(router);
  }
}

class MockProductReferenceService {
  get(): Observable<UIProductReference[]> {
    return of(list);
  }
}

const mockComponentData: CmsProductReferencesComponent = {
  uid: 'MockProductReferencesComponent',
  typeCode: 'ProductReferencesComponent',
  title: 'mockTitle',
  productReferenceTypes: 'referenceType',
};

const MockCmsComponentData = <CmsComponentData<any>>{
  data$: of(mockComponentData),
};

describe('ProductReferencesService', () => {
  let productReferenceService: ProductReferencesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: CmsComponentData,
          useValue: MockCmsComponentData,
        },
        {
          provide: ProductReferenceService,
          useClass: MockProductReferenceService,
        },
        {
          provide: RoutingService,
          useClass: MockRoutingService,
        },
        ProductReferencesService,
      ],
    });

    productReferenceService = TestBed.get(ProductReferencesService);
  });

  it('should inject ProductReferencesService', () => {
    expect(productReferenceService).toBeTruthy();
  });

  it('should getReferenceType()', () => {
    spyOn(productReferenceService, 'getReferenceType').and.callThrough();

    productReferenceService.getReferenceType();
    expect(productReferenceService.getReferenceType).toHaveBeenCalled();
  });

  it('should getProductCode()', () => {
    spyOn(productReferenceService, 'getProductCode').and.callThrough();

    productReferenceService.getProductCode();
    expect(productReferenceService.getProductCode).toHaveBeenCalled();
  });

  it('should have title', () => {
    spyOn(productReferenceService, 'setTitle').and.callThrough();
    spyOn(productReferenceService, 'getTitle').and.callThrough();

    let title$: string;

    productReferenceService.setTitle();
    productReferenceService
      .getTitle()
      .subscribe(data => {
        title$ = data;
      })
      .unsubscribe();

    expect(title$).toBe(title);
  });

  it('should have product list', () => {
    spyOn(productReferenceService, 'setReferenceList').and.callThrough();
    spyOn(productReferenceService, 'getReferenceList').and.callThrough();

    let list$: UIProductReference[];

    productReferenceService.setReferenceList();
    productReferenceService
      .getReferenceList()
      .subscribe(data => {
        list$ = data;
      })
      .unsubscribe();

    expect(list$).toBe(list);
  });
});