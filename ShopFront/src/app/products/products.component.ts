import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Product } from '../model/product';
import { ProductsService } from '../services/products.service';
import { CategoriesService } from '../services/categories.service';

import 'rxjs/add/operator/switchMap';

@Component({
    templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit {
    categories: any[];
    currentProducts: Product[];
    params: Params;

    constructor(private route: ActivatedRoute, private productsService: ProductsService, private categoriesService: CategoriesService) { }

    ngOnInit() {
        this.route.queryParams
            .subscribe(params => {
                this.params = params;

                this.fetchProducts();
            });
    }

    public fetchProducts() {
        this.productsService.getAllProducts(this.params).subscribe(products => {
            this.currentProducts = products;
        }, error => {
            alert(error);
        });

        this.categoriesService.getCategories().subscribe(cats => {
            this.categories = cats;
        }, error => {
            alert(error);
        });
    }
}
