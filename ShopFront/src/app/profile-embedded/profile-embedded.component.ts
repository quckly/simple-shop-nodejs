import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { BasketService } from '../services/basket.service';
import { LoginService } from '../services/login.service';
import { Product } from '../model/product';

@Component({
    selector: 'app-profile-embedded',
    templateUrl: './profile-embedded.component.html'
})
export class ProfileEmbeddedComponent implements OnInit {
    auth: boolean;
    user: any;
    basket: any;
    basketLength: number;
    sum: number;

    constructor(private productsService: ProductsService, private basketService: BasketService, private loginService: LoginService) {
        
    }

    public fetchLogin() {
        this.loginService.getProfile().subscribe(loginInfo => {
            this.auth = loginInfo.auth;
            this.user = loginInfo.user;
            //alert(JSON.stringify(loginInfo));
        }, error => {
            alert(error);
        });
    }

    public fetchBasket() {
        this.basketService.getBasket().subscribe(basket => {
            this.basket = basket;
            this.basketLength = Object.keys(this.basket.items).length;
        }, error => {
            alert(error);
        });
    }

    ngOnInit() {
        // Auth login
        this.fetchLogin();

        // Update login
        this.loginService.loginUpdateSource$.subscribe(() => {
            this.fetchLogin();
            this.fetchBasket();
        })

        // Basket
        this.fetchBasket();

        // Add product from other components
        this.basketService.basketUpdateSource$.subscribe(value => {
            if (value) {
                this.basket = value;
                this.basketLength = Object.keys(this.basket.items).length;
            } else {
                this.fetchBasket();
            }
        });
    }
}
