import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Product } from '../model/product';
import { ProductsService } from '../services/products.service';
import { CategoriesService } from '../services/categories.service';
import { BasketService } from '../services/basket.service';

import 'rxjs/add/operator/switchMap';

@Component({
    templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {
    categories: any[];
    product: Product;
    error: any;
    inBasket: number = 0;

    //currentClasses = {
    //    "btn-success": this.inBasket == 0,
    //    "btn-success": this.inBasket != 0,
    //}

    constructor(private route: ActivatedRoute, private products: ProductsService, private categoriesService: CategoriesService, private basketService: BasketService) { }

    ngOnInit() {
        this.route.params
            .switchMap((params: Params) => this.products.getProduct(params['id']))
            .subscribe(res => {
                this.product = res;

                this.basketService.getBasket().subscribe(basket => {
                    this.inBasket = basket.items[this.product._id] ? basket.items[this.product._id].count : 0;
                }, error => {
                    alert(error);
                });
                //alert(JSON.stringify(res));
            }, error => {
                this.error = error;
            });

        this.categoriesService.getCategories().subscribe(cats => {
            this.categories = cats;
        }, error => {
            this.error = error;
            });

        // Add product from other components
        this.basketService.basketUpdateSource$.subscribe(basket => {
            if (basket) {
                this.inBasket = basket.items[this.product._id] ? basket.items[this.product._id].count : 0;
            }
        });
    }

    addTobasket() {
        this.basketService.addToBasket(this.product).subscribe(basket => {
            this.basketService.updateBasket(basket);
        }, error => {
            this.error = error;
        });
    }
}
