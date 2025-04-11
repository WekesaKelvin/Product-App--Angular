import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProductService } from './product.service';
import { Router } from '@angular/router';
import { Product } from '../product.model';

describe('ProductService', () => {
  let service: ProductService;
  let mockRouter: any;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj(['navigate']);
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        { provide: Router, useValue: mockRouter }
      ]
    });
    service = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return initial products after delay', fakeAsync(() => {
    let result: Product[] = [];
    service.getProducts$().subscribe(products => result = products);
    tick(500);
    expect(result.length).toBe(2);
    expect(result[0].name).toBe('Laptop');
  }));

  it('should add a product successfully', fakeAsync(() => {
    spyOn(Math, 'random').and.returnValue(0.9); // Force success
    const productData: Product = { id: 0, name: 'Tablet', price: 300 };
    let added: Product | undefined;

    service.addProduct(productData).subscribe(p => added = p);
    tick(500);

    expect(added).toBeDefined();
    expect(added!.id).toBe(3);
    expect(added!.name).toBe('Tablet');
  }));

  it('should fail to add product if random check fails', fakeAsync(() => {
    spyOn(Math, 'random').and.returnValue(0.1); // Force failure
    let errorMsg: string = '';

    service.addProduct({ id: 0, name: 'Tablet', price: 300 }).subscribe({
      next: () => fail('Expected failure'),
      error: err => errorMsg = err
    });
    tick(500);

    expect(errorMsg).toContain('Simulated API failure');
  }));

  it('should update existing product successfully', fakeAsync(() => {
    const updatedProduct: Product = { id: 1, name: 'Gaming Laptop', price: 1500 };
    let result: Product | undefined;

    service.updateProduct(updatedProduct).subscribe(p => result = p);
    tick(500);

    expect(result).toEqual(updatedProduct);
  }));

  it('should fail to update non-existent product', fakeAsync(() => {
    let errorMsg = '';
    service.updateProduct({ id: 99, name: 'Invalid', price: 0 }).subscribe({
      next: () => fail('Expected failure'),
      error: err => errorMsg = err
    });
    tick(500);

    expect(errorMsg).toContain('Product not found');
  }));

  it('should delete existing product successfully', fakeAsync(() => {
    let result = false;
    service.deleteProduct(1).subscribe(res => result = res);
    tick(500);

    expect(result).toBeTrue();
  }));

  it('should fail to delete non-existent product', fakeAsync(() => {
    let errorMsg = '';
    service.deleteProduct(999).subscribe({
      next: () => fail('Expected failure'),
      error: err => errorMsg = err
    });
    tick(500);

    expect(errorMsg).toContain('Product not found');
  }));

  it('should return updated product list after adding', fakeAsync(() => {
    spyOn(Math, 'random').and.returnValue(0.9); // Ensure success
    let updatedList: Product[] = [];

    service.addProduct({ id: 0, name: 'Monitor', price: 250 }).subscribe(() => {
      service.getProducts$().subscribe(products => updatedList = products);
    });
    tick(1000); // Add + Get delay

    expect(updatedList.find(p => p.name === 'Monitor')).toBeTruthy();
  }));

  it('should return updated product list after deleting', fakeAsync(() => {
    let updatedList: Product[] = [];

    service.deleteProduct(1).subscribe(() => {
      service.getProducts$().subscribe(products => updatedList = products);
    });
    tick(1000); 

    expect(updatedList.find(p => p.id === 1)).toBeFalsy();
  }));

});
