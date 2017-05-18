import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject'
import 'rxjs/add/operator/map';

import { Product } from '../model/product';

@Injectable()
export class BasketService {
    private basketUpdateSource = new Subject<any>();
    basketUpdateSource$ = this.basketUpdateSource.asObservable();
    
    httpOptions = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json' }), withCredentials: true });

    constructor(private http: Http) { }

    addToBasket(product: Product): Observable<any> {
        let path = 'http://localhost:1337/basket/add';
        return this.http.post(path, JSON.stringify(product), this.httpOptions).map(res => {
            let response = res.json();

            if (response.error) {
                throw new Error(response.error);
            }

            return response.result;
        });
    }

    updateBasket(newBasket?: any) {
        this.basketUpdateSource.next(newBasket);
    }

    getBasket(): Observable<any> {
        let path = 'http://localhost:1337/basket/';
        return this.http.get(path, { withCredentials: true }).map(res => {
            let response = res.json();

            if (response.error) {
                throw new Error(response.error);
            }

            return response.result as any;
        });
    }

    setBasket(basket: any) {
        let path = 'http://localhost:1337/basket/';
        return this.http.put(path, JSON.stringify(basket), this.httpOptions).map(res => {
            let response = res.json();

            if (response.error) {
                throw new Error(response.error);
            }

            return response;
        });
    }
}
