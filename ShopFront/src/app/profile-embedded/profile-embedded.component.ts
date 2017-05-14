import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { BasketService } from '../services/basket.service';
import { Product } from '../model/product';

@Component({
  selector: 'app-profile-embedded',
  templateUrl: './profile-embedded.component.html'
})
export class ProfileEmbeddedComponent implements OnInit {
    auth: boolean;
    user: any;
    basket: any;

    constructor(private productsService: ProductsService, private basketService: BasketService) {

    }

    ngOnInit() {

    }
}
