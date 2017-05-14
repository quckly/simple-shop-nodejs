import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Params } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Product } from '../model/product';

@Injectable()
export class ProductsService {
    constructor(private http: Http) {
    }

    getProduct(id: string): Observable<Product> {
        let path = 'http://localhost:1337/products/' + id;
        return this.http.get(path, { withCredentials: true }).map(res => {
            let response = res.json();

            if (response.error) {
                throw new Error(response.error);
            }

            return response.result as Product;
        });
    }

    getAllProducts(params?: Params): Observable<Product[]> {
        let path = 'http://localhost:1337/products';

        return this.http.get(path, { params: params || {}, withCredentials: true }).map(res => {
            let response = res.json();

            if (response.error) {
                throw new Error(response.error);
            }

            return response.result as Product[];
        });
    }

    getNewProducts(): Observable<Product[]> {
        let path = 'http://localhost:1337/products/new';
        return this.http.get(path, { withCredentials: true }).map(res => {
            let response = res.json();

            if (response.error) {
                throw new Error(response.error);
            }

            return response.result as Product[];
        });
    }

    getTopProducts(): Observable<Product[]> {
        let path = 'http://localhost:1337/products/top';
        return this.http.get(path, { withCredentials: true }).map(res => {
            let response = res.json();

            if (response.error) {
                throw new Error(response.error);
            }
            
            return response.result as Product[];
        });
    }

    addProduct(product): Observable<any> {
        let path = 'http://localhost:1337/products/';
        return this.http.post(path, JSON.stringify(product), { withCredentials: true }).map(res => {
            let response = res.json();

            if (response.error) {
                throw new Error(response.error);
            }

            return response.result;
        });
    }
}
