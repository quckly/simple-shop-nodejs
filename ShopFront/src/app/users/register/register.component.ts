import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
    templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
    model: any = { login: "", password: "" };

    constructor(private loginService: LoginService, private router: Router) { }

    ngOnInit() {

    }

    register() {
        this.loginService.register(this.model).subscribe(res => {
            this.loginService.updateLogin();
            this.router.navigate(['/']);
        }, err => {
            alert(err);
        });
    }
}
