import { createFeatureSelector, createSelector } from '@ngrx/store';
import { productFeatureKey, ProductState } from './product.reducer';

export const selectProductState = createFeatureSelector<ProductState>(productFeatureKey);

export const selectAllProducts = createSelector(
  selectProductState,
  (state: ProductState) => state.products
);


export const selectError = createSelector(
  selectProductState,
  (state: ProductState) => state.error
);