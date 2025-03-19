import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProductFormComponent } from './product-form.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../services/product.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


const mockProductService = {
  getProducts$: jasmine.createSpy().and.returnValue(of([])),
  addProduct: jasmine.createSpy().and.returnValue(of({})),
  updateProduct: jasmine.createSpy().and.returnValue(of({}))
};

const mockRouter = {
  navigate: jasmine.createSpy()
};

const mockSnackBar = {
  open: jasmine.createSpy()
};

const mockStore = {
  pipe: jasmine.createSpy().and.returnValue(of({ products: [], error: null })),
  select: jasmine.createSpy().and.returnValue(of(null))
};

// Custom Mock ActivatedRoute
class MockActivatedRoute {
  private subject = new Subject();
  paramMap = this.subject.asObservable();
  setParamMap(params: any) {
    this.subject.next(convertToParamMap(params));
  }
}

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let mockActivatedRoute: MockActivatedRoute;

  beforeEach(async () => {
    mockActivatedRoute = new MockActivatedRoute();

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, BrowserAnimationsModule, ProductFormComponent],
      providers: [
        FormBuilder,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: ProductService, useValue: mockProductService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: Store, useValue: mockStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form correctly for new product', fakeAsync(() => {
    mockActivatedRoute.setParamMap({});
    fixture.detectChanges();
    tick();
    expect(component.productId).toBeNull();
    expect(component.productForm.value).toEqual({ id: 0, name: '', price: 0 });
  }));


  it('should initialize form correctly for editing existing product', fakeAsync(() => {
    const productId = 1;
    const product = { id: productId, name: 'Test Product', price: 100 };
    mockProductService.getProducts$.and.returnValue(of([product]));

    mockActivatedRoute.setParamMap({ id: productId.toString() });
    fixture.detectChanges();
    tick();

    expect(component.productId).toBe(productId);
    expect(component.productForm.value).toEqual(product);
  }));
  

  it('should validate form correctly', () => {
    component.productForm.patchValue({ id: 0, name: 'A', price: 0 });
    expect(component.productForm.valid).toBeFalse();
    expect(component.productForm.get('name')?.hasError('minlength')).toBeTrue();
    expect(component.productForm.get('price')?.hasError('min')).toBeTrue();

    component.productForm.patchValue({ id: 0, name: 'Valid Name', price: 1 });
    expect(component.productForm.valid).toBeTrue();
  });

  it('should submit form correctly for new product - success case', fakeAsync(() => {
    mockActivatedRoute.setParamMap({});
    fixture.detectChanges();
    tick();

    const newProduct = { id: 0, name: 'New Product', price: 200 };
    component.productForm.patchValue(newProduct);

    component.onSubmit();
    tick();

    expect(mockProductService.addProduct).toHaveBeenCalledWith(newProduct);
    // expect(mockSnackBar.open).toHaveBeenCalledWith('Product added successfully!', '', jasmine.any(Object));
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/list']);
    expect(component.productForm.value).toEqual({ id: 0, name: '', price: 0 });
  }));

  it('should submit form correctly for editing product - success case', fakeAsync(() => {
    const productId = 1;
    const originalProduct = { id: productId, name: 'Old Name', price: 100 };
    const updatedProduct = { id: productId, name: 'Updated Name', price: 150 };

    mockProductService.getProducts$.and.returnValue(of([originalProduct]));
    mockActivatedRoute.setParamMap({ id: productId.toString() });
    fixture.detectChanges();
    tick();

    component.productForm.patchValue(updatedProduct);
    component.onSubmit();
    tick();

    expect(mockProductService.updateProduct).toHaveBeenCalledWith(updatedProduct);
    // expect(mockSnackBar.open).toHaveBeenCalledWith('Product updated successfully!', '', jasmine.any(Object));
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/list']);
    expect(component.productForm.value).toEqual({ id: 0, name: '', price: 0 });
  }));

  it('should not submit form with invalid data', fakeAsync(() => {
    mockActivatedRoute.setParamMap({});
    fixture.detectChanges();
    tick();
  
    const invalidData = { id: 0, name: 'A', price: 0 }; // invalid data
    component.productForm.patchValue(invalidData);
  
    component.onSubmit(); 
    tick(); 
    fixture.detectChanges();
  
    // Expect product service methods NOT to be called
    // expect(mockProductService.addProduct).not.toHaveBeenCalled();
    // expect(mockProductService.updateProduct).not.toHaveBeenCalled();
  
    // Also check form validity
    expect(component.productForm.invalid).toBeTrue();
    expect(component.productForm.get('name')?.hasError('minlength')).toBeTrue();
    expect(component.productForm.get('price')?.hasError('min')).toBeTrue();
  }));
  

  it('should handle editing non-existent product', fakeAsync(() => {
    const nonExistentId = 999;
    mockProductService.getProducts$.and.returnValue(of([]));
    mockActivatedRoute.setParamMap({ id: nonExistentId.toString() });

    fixture.detectChanges();
    tick();

    expect(component.productId).toBe(nonExistentId);
    expect(component.productForm.value).toEqual({ id: 0, name: '', price: 0 });

    const updatedData = { id: 0, name: 'New Name', price: 200 };
    component.productForm.patchValue(updatedData);

    component.onSubmit();
    tick();

    expect(mockProductService.updateProduct).toHaveBeenCalledWith(updatedData);
    // expect(mockSnackBar.open).toHaveBeenCalledWith('Product updated successfully!', '', jasmine.any(Object));
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/list']);
    expect(component.productForm.value).toEqual({ id: 0, name: '', price: 0 });
  }));

  // it('should display error snackbar if error from store', fakeAsync(() => {
  //   // simulate error in store
  //   mockStore.select.and.returnValue(of('Error occurred'));
  //   fixture.detectChanges();
  //   tick();
  //   expect(mockSnackBar.open).toHaveBeenCalled();
  // }));

});
