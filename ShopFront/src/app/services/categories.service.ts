import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Params } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Product } from '../model/product';

@Injectable()
export class CategoriesService {
    constructor(private http: Http) {
    }

    getCategories(): Observable<any[]> {
        let path = 'http://localhost:1337/categories';

        return this.http.get(path, { withCredentials: true }).map(res => {
            let response = res.json();

            if (response.error) {
                throw new Error(response.error);
            }

            return response.result as any[];
        });
    }
}
