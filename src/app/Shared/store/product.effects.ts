import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { ProductService } from '../product.service';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as ProductActions from './product.actions';

@Injectable()
export class ProductEffects {
  private actions$ = inject(Actions) as Actions;
  private router = inject(Router);
  private productService = inject(ProductService);


  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProducts),
      switchMap(() =>
        this.productService.getProducts$().pipe(
          map(products => ProductActions.loadProductsSuccess({ products })),
          catchError(error => of(ProductActions.loadProductsFailure({ error })))
        )
      )
    )
  );


  addProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.addProduct),
      switchMap(({ product }) =>
        this.productService.addProduct(product).pipe(
          map(addedProduct => ProductActions.addProductSuccess({ product: addedProduct })),
          catchError(error => of(ProductActions.addProductFailure({ error })))
        )
      )
    )
  );


  updateProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.updateProduct),
      switchMap(({ product }) =>
        this.productService.updateProduct(product).pipe(
          map(updatedProduct => {
            if (updatedProduct) {
              return ProductActions.updateProductSuccess({ product: updatedProduct });
            } else {
              return ProductActions.updateProductFailure({ error: 'Product update failed' });
            }
          }),
          catchError(error => of(ProductActions.updateProductFailure({ error })))
        )
      )
    )
  );


  deleteProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.deleteProduct),
      switchMap(({ productId }) =>
        this.productService.deleteProduct(productId).pipe(
          map(() => ProductActions.deleteProductSuccess({ productId })),
          catchError(error => of(ProductActions.deleteProductFailure({ error })))
        )
      )
    )
  );


  navigationEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.addProductSuccess, ProductActions.updateProductSuccess),
      tap(() => {
        this.router.navigate(['/list']);
      })
    ),
    { dispatch: false }
  );
}
