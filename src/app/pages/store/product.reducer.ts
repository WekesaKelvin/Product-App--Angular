import { createReducer, on } from '@ngrx/store';
import { Product } from '../../product.model';
import * as ProductActions from './product.actions';

export const productFeatureKey = 'product';

export interface ProductState {
  products: Product[];
  error: any; 
}

export const initialState: ProductState = {
  products: [],
  error: null
};

export const productReducer = createReducer(
  initialState,
  on(ProductActions.loadProductsSuccess, (state, { products }) => ({
    ...state,
    products,
    error: null
  })),
  on(ProductActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    error
  })),
  on(ProductActions.addProductSuccess, (state, { product }) => ({
    ...state,
    products: [...state.products, product],
    error: null
  })),
  on(ProductActions.addProductFailure, (state, { error }) => ({
    ...state,
    error
  })),
  on(ProductActions.updateProductSuccess, (state, { product }) => ({
    ...state,
    products: state.products.map(p => (p.id === product.id ? product : p)),
    error: null
  })),
  on(ProductActions.updateProductFailure, (state, { error }) => ({
    ...state,
    error
  })),
  on(ProductActions.deleteProductSuccess, (state, { productId }) => ({
    ...state,
    products: state.products.filter(p => p.id !== productId),
    error: null
  })),
  on(ProductActions.deleteProductFailure, (state, { error }) => ({
    ...state,
    error
  }))
);
