import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../services/product.service';
import { of, throwError } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../product.model';
// import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';


const mockProducts: Product[] = [
  { id: 1, name: 'Product 1', price: 50 },
  { id: 2, name: 'Product 2', price: 100 },
];

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let mockProductService: any;
  let mockMatDialog: any;
  let mockSnackBar: any;
  let router: Router;

  beforeEach(async () => {
   
    mockProductService = {
      getProducts$: jasmine.createSpy().and.returnValue(of(mockProducts)),
      deleteProduct: jasmine.createSpy().and.returnValue(of({}))
    };

    // Mock MatDialog with comprehensive MatDialogRef and internal state
    class MockMatDialog {
      private openDialogs: any[] = [];

      open(component: any, config?: any) {
        const dialogRefMock = {
          afterClosed: () => of(true),
          close: jasmine.createSpy(),
          componentInstance: {},
          backdropClick: () => of(null),
          keyboardEvents: () => of(null)
        };
        this.openDialogs.push(dialogRefMock);
        return dialogRefMock;
      }
    }
    mockMatDialog = new MockMatDialog();

    mockSnackBar = {
      open: jasmine.createSpy()
    };

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        MatDialogModule,
        MatSnackBarModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        RouterTestingModule,
        // ConfirmDialogComponent
      ],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        // { provide: MatDialog, useValue: mockMatDialog },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    fixture.detectChanges();
    expect(mockProductService.getProducts$).toHaveBeenCalled();
    component.products$.subscribe(products => {
      expect(products).toEqual(mockProducts);
    });
  });

  it('should navigate to edit product on editProduct()', () => {
    const productId = 1;
    component.editProduct(productId);
    expect(router.navigate).toHaveBeenCalledWith(['/form', productId]);
  });

  // it('should delete product after confirmation', fakeAsync(() => {
  //   fixture.detectChanges();
  //   component.deleteProduct(1);
  //   tick();
  //   expect(mockMatDialog.open).toHaveBeenCalled();
  //   expect(mockProductService.deleteProduct).toHaveBeenCalledWith(1);
  //   expect(mockSnackBar.open).toHaveBeenCalledWith(
  //     'Product deleted successfully',
  //     'Close',
  //     jasmine.any(Object)
  //   );
  

  // it('should handle deletion failure gracefully', fakeAsync(() => {
  //   mockMatDialog.open.and.returnValue({
  //     afterClosed: () => of(true)
  //   });

  //   mockProductService.deleteProduct.and.returnValue(throwError(() => new Error('Deletion error')));
  //   fixture.detectChanges();
  //   component.deleteProduct(2);
  //   tick();
  //   expect(mockSnackBar.open).toHaveBeenCalledWith(
  //     'Failed to delete product: Deletion error',
  //     'Close',
  //     jasmine.any(Object)
  //   );
  // }));

//   it('should not delete product if user cancels confirmation', fakeAsync(() => {
//     mockMatDialog.open.and.returnValue({
//       afterClosed: () => of(false)
//     });
//     fixture.detectChanges();
//     component.deleteProduct(1);
//     tick();
//     expect(mockProductService.deleteProduct).not.toHaveBeenCalled();
//   }));
});