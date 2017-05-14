import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { CategoriesService } from '../services/categories.service';
import { Product } from '../model/product';

@Component({
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
    newProducts: Product[];
    topProducts: Product[];
    topCategories: any[];

    constructor(private productsService: ProductsService, private categoriesService: CategoriesService) {
    }

    ngOnInit() {
        this.productsService.getTopProducts().subscribe(products => {
            this.topProducts = products;
            this.topProducts[0]['active'] = true;
        }, error => {
            alert(error);
        });

        this.productsService.getNewProducts().subscribe(products => {
            this.newProducts = products;
            this.newProducts[0]['active'] = true;
        }, error => {
            alert(error);
        });

        this.categoriesService.getCategories().subscribe(cats => {
            this.topCategories = cats;
        }, error => {
            alert(error);
        });
    }

}
