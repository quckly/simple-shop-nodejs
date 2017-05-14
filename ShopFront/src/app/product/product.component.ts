import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Product } from '../model/product';
import { ProductsService } from '../services/products.service';

import 'rxjs/add/operator/switchMap';

@Component({
  templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {
    product: Product;

    constructor(private route: ActivatedRoute, private products: ProductsService) { }

    ngOnInit() {
        this.route.params
            .switchMap((params: Params) => this.products.getProduct(params['id']))
            .subscribe(res => {
                this.product = res;
            });
    }

}
