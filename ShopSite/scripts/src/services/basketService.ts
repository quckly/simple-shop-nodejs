import { Component, View } from 'angular2/angular2';
import { Inject} from 'angular2/di';
import { Http } from 'angular2/http';

export class BasketService {
    constructor( @Inject(Http) private http: Http) {
	}

    getBasket() : any {
        var path = '/basket/';
		return this.http.get(path);
    }

	addToBasket(item) {
        var path = '/basket/';
        return this.http.post(path, JSON.stringify(item));
    }

    deleteFromBasket(id) {
        var path = '/basket/' + id;
        return this.http.delete(path);
    }
}
