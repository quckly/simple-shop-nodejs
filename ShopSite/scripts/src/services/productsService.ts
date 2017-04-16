import { Component, View } from 'angular2/angular2';
import { Inject} from 'angular2/di';
import { Http } from 'angular2/http';

export class ProductsService {
    constructor( @Inject(Http) private http: Http) {
	}

    getProduct(id: string): any {
		var path = '/products/' + id;
		return this.http.get(path);
	}

    getAllProducts() : any {
        var path = '/products/';
		return this.http.get(path);
	}

	addProduct(product) {
        var path = '/products/';
        return this.http.post(path, JSON.stringify(product));
	}
}
