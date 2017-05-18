import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
    model: any = { login: "", password: "" };

    constructor(private loginService: LoginService, private router: Router) { }

    ngOnInit() {

    }

    login() {
        this.loginService.login(this.model).subscribe(res => {
            this.loginService.updateLogin();
            this.router.navigate(['/']);
        }, err => {
            alert(err);
        });
    }
}
