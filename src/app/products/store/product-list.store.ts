import { Injectable, inject } from '@angular/core';
import { IProduct } from '../product';
import { ComponentStore } from '@ngrx/component-store';
import { ProductService } from '../product.service';
import { switchMap, tap } from 'rxjs';

export interface ProductListState {
  products: IProduct[];
  filteredProducts: IProduct[];
  showImage: boolean;
  errorMessage: string;
  filterText: string;
}

export const ProductListInitialState = {
  products: [],
  filteredProducts: [],
  showImage: false,
  errorMessage: '',
  filterText: '',
};

@Injectable()
export class ProductListStore extends ComponentStore<ProductListState> {
  private readonly productService = inject(ProductService);
  constructor() {
    super(ProductListInitialState);
  }

  readonly setFilter = this.updater((state, filterText: string) => ({
    ...state,
    filterText,
    filteredProducts: this.filterProducts(state.products, filterText),
  }));

  readonly toggleImage = this.updater((state) => ({
    ...state,
    showImage: !state.showImage,
  }));

  readonly getProducts = this.effect((trigger$) =>
    trigger$.pipe(
      switchMap(() => this.productService.getProducts()),
      tap({
        next: (products) =>
          this.patchState({
            products,
            filteredProducts: this.filterProducts(
              products,
              this.get().filterText
            ),
          }),
        error: (errorMessage) => this.patchState({ errorMessage }),
      })
    )
  );

  readonly addProduct = this.effect<IProduct>((product$) => 
      product$.pipe(
        switchMap(newProduct => this.productService.addProduct(newProduct).pipe(
          tap({
            next: (product) => {
              this.patchState(state => ({
                products: [...state.products, product],
                filteredProducts: this.filterProducts([...state.products, product], state.filterText)
              }))
            }
          })
        ))
      )
  )

  private filterProducts(products: IProduct[], filterBy: string): IProduct[] {
    filterBy = filterBy.toLocaleLowerCase();
    return products.filter((product: IProduct) =>
      product.productName.toLocaleLowerCase().includes(filterBy)
    );
  }
}
