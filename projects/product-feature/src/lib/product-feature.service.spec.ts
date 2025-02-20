import { TestBed } from '@angular/core/testing';

import { ProductFeatureService } from './product-feature.service';

describe('ProductFeatureService', () => {
  let service: ProductFeatureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductFeatureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
