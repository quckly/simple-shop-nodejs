import { Component, View } from 'angular2/angular2';
import { Inject} from 'angular2/di';
import { Http } from 'angular2/http';

export class UsersService {
    constructor( @Inject(Http) private http: Http) {
	}

    getUser(id: string): any {
        var path = '/users/' + id;
		return this.http.get(path);
	}

    getAllUsers() : any {
        var path = '/users/';
		return this.http.get(path);
    }

	createUser(item) {
        var path = '/users/';
        return this.http.post(path, JSON.stringify(item));
    }

    getProfile() {
        var path = '/users/profile';
        return this.http.get(path);
    }
}
