import { Component, View } from 'angular2/angular2';
import { Inject} from 'angular2/di';
import { Http } from 'angular2/http';

export class CategoriesService {
    constructor( @Inject(Http) private http: Http) {
	}

    getCategories(id: string): any {
        var path = '/categories/' + id;
		return this.http.get(path);
	}

    getAllCategories() : any {
        var path = '/categories/';
		return this.http.get(path);
    }

	addCategory(item) {
        var path = '/categories/';
        return this.http.post(path, JSON.stringify(item));
	}
}
