import { Component  } from '@angular/core';
import { NgFor } from '@angular/common'
import { _settings } from '../../settings'
import { ProductsService } from "../../services/productsService";
import { CategoriesService } from "../../services/categoriesService";
import { Inject } from 'angular2/di';

@Component({
    selector: 'home',
    injectables: [ProductsService],
    templateUrl: _settings.buildPath + "/components/home/home.html",
    directives: [NgFor]
})
export class Home {
    newProducts: Array<any>;
    topProducts: Array<any>;
    topCategories: Array<any>;

    constructor( @Inject(ProductsService) private productsService: ProductsService, @Inject(CategoriesService) private categoriesService: CategoriesService) {
        //productsService.getNewProducts()
        //.map(r => r.json())
        //.subscribe(a => {
        //    this.newProducts = a;
        //});
        this.newProducts = [{ "_id": 1, "Name": "Product 1", "Price": 4200, "Photo": "" }, { "_id": 2, "Name": "Product 2", "Price": 4200 },
            { "_id": 3, "Name": "Product 3", "Price": 4200 }, { "_id": 4, "Name": "Product 4", "Price": 1337 }];
        this.topProducts = this.newProducts;
        this.topCategories = [{ "_id": 1, "Name": "Категория 1", "Photo": "" }, { "_id": 2, "Name": "Категория 2" }, { "_id": 3, "Name": "Категория 3" }];
    }
}