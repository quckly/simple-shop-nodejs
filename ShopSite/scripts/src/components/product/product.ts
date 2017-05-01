import { Component, View, NgFor } from 'angular2/angular2';
import { _settings } from '../../settings'
import { ProductsService } from "../../services/productsService";
import { CategoriesService } from "../../services/categoriesService";
import { Inject } from 'angular2/di';

@Component({
    selector: 'product',
    injectables: [ProductsService]
})
@View({
    templateUrl: _settings.buildPath + "/components/product/product.html",
    directives: [NgFor]
})
export class ProductComponent {
    product: any;

    constructor( @Inject(ProductsService) private productsService: ProductsService, @Inject(CategoriesService) private categoriesService: CategoriesService) {
        //productsService.getNewProducts()
        //.map(r => r.json())
        //.subscribe(a => {
        //    this.newProducts = a;
        //});
        this.product = { "_id": 1, "Name": "Product 1", "Price": 4200, "Photo": "" };
    }
}