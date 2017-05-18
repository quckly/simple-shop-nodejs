import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Params } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject'
import 'rxjs/add/operator/map';

@Injectable()
export class LoginService {
    private loginUpdateSource = new Subject<any>();
    loginUpdateSource$ = this.loginUpdateSource.asObservable();

    httpOptions = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json' }), withCredentials: true });

    constructor(private http: Http) {
    }

    public updateLogin() {
        this.loginUpdateSource.next({});
    }

    login(credentials: any): Observable<any> {
        let path = 'http://localhost:1337/login';

        return this.http.post(path, JSON.stringify(credentials), this.httpOptions).map(res => {
            let response = res.json();

            if (response.error) {
                throw new Error(response.error);
            }

            return response.result;
        });
    }

    register(credentials: any): Observable<any> {
        let path = 'http://localhost:1337/login/register';

        return this.http.post(path, JSON.stringify(credentials), this.httpOptions).map(res => {
            let response = res.json();

            if (response.error) {
                throw new Error(response.error);
            }

            return response.result;
        });
    }

    getProfile(): Observable<any> {
        let path = 'http://localhost:1337/login/profile';

        return this.http.get(path, this.httpOptions).map(res => {
            let response = res.json();

            if (response.error) {
                throw new Error(response.error);
            }

            return response.result as any;
        });
    }
}
