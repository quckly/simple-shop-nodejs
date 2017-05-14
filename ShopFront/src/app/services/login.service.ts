import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Params } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class LoginService {
    constructor(private http: Http) {
    }

    login(credentials: any): Observable<any> {
        let path = 'http://localhost:1337/login';

        return this.http.post(path, JSON.stringify(credentials), { withCredentials: true }).map(res => {
            let response = res.json();

            if (response.error) {
                throw new Error(response.error);
            }

            return response.result;
        });
    }

    register(credentials: any): Observable<any> {
        let path = 'http://localhost:1337/login/register';

        return this.http.post(path, JSON.stringify(credentials), { withCredentials: true }).map(res => {
            let response = res.json();

            if (response.error) {
                throw new Error(response.error);
            }

            return response.result;
        });
    }

    getProfile(): Observable<any> {
        let path = 'http://localhost:1337/login/profile';

        return this.http.get(path, { withCredentials: true }).map(res => {
            let response = res.json();

            if (response.error) {
                throw new Error(response.error);
            }

            return response.result as any;
        });
    }
}
