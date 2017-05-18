import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { BasketService } from '../services/basket.service';
import { LoginService } from '../services/login.service';
import { Product } from '../model/product';

@Component({
    templateUrl: './basket.component.html'
})
export class BasketComponent implements OnInit {
    basket: any = { items: {} };
    basketArray: any[] = [];
    basketLength: number = 0;
    sum: number = 0;

    constructor(private productsService: ProductsService, private basketService: BasketService, private loginService: LoginService) {
    }

    ngOnInit() {
        this.fetchBasket();
    }

    public fetchBasket() {
        this.basketService.getBasket().subscribe(basket => {
            this.sum = 0;

            this.basket = basket;
            this.basketLength = Object.keys(this.basket.items).length;
            Object.keys(this.basket.items).forEach(key => {
                let productsSum = this.basket.items[key].count * this.basket.items[key].product.price;
                this.basketArray.push(this.basket.items[key]);

                this.sum = this.sum + productsSum;
            });
        }, error => {
            alert(error);
        });
    }

    public createOrder() {

    }

    public removeItem(item: any) {
        alert(JSON.stringify(item));
        delete this.basket.items[item.product._id];
        this.basketService.setBasket(this.basket).subscribe(ok => {
            this.fetchBasket();
        }, err => {
            alert(err)
        });
    }
}
