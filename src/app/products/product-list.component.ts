import {
  AsyncPipe,
  CurrencyPipe,
  LowerCasePipe,
  NgFor,
  NgIf,
} from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ConvertToSpacesPipe } from '../shared/convert-to-spaces.pipe';
import { StarComponent } from '../shared/star.component';
import { ProductListStore } from './store/product-list.store';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgFor,
    RouterLink,
    StarComponent,
    LowerCasePipe,
    CurrencyPipe,
    ConvertToSpacesPipe,
    AsyncPipe,
  ],
  providers: [ProductListStore],
})
export class ProductListComponent implements OnInit {
  pageTitle = 'Product List';
  imageWidth = 50;
  imageMargin = 2;

  private readonly store = inject(ProductListStore);

  // Selectors
  readonly products$ = this.store.select((state) => state.products);
  readonly errorMessage$ = this.store.select((state) => state.errorMessage);
  readonly filterText$ = this.store.select((state) => state.filterText);
  readonly filteredProducts$ = this.store.select(
    (state) => state.filteredProducts
  );
  readonly showImage$ = this.store.select((state) => state.showImage);

  toggleImage(): void {
    this.store.toggleImage();
  }

  ngOnInit(): void {
    this.store.getProducts();
  }

  onFilterChange(value: string) {
    this.store.setFilter(value);
  }

  onRatingClicked(message: string): void {
    this.pageTitle = 'Product List: ' + message;
  }
}
