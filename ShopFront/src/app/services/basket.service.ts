import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject'
import 'rxjs/add/operator/map';

import { Product } from '../model/product';

@Injectable()
export class BasketService {
    private basketUpdateSource = new Subject<any>();
    basketUpdateSource$ = this.basketUpdateSource.asObservable;

    constructor(private http: Http) { }

    addToBasket(product: Product) {

        this.basketUpdateSource.next({}); // TODO: add basket
    }

    getBasket(): any {
        let path = 'http://localhost:1337/basket/';
        return this.http.get(path).map(res => {
            let response = res.json();

            if (response.error) {
                throw new Error(response.error);
            }

            return response.result as any;
        });
    }

    setBasket(basket: any) {
        let path = 'http://localhost:1337/basket/';
        return this.http.put(path, JSON.stringify(basket)).map(res => {
            let response = res.json();

            if (response.error) {
                throw new Error(response.error);
            }

            return response;
        });
    }
}
