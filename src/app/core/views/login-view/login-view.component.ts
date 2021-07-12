import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Login } from 'src/app/shared/state/auth';

@Component({
    selector: 'fc-login-view',
    templateUrl: './login-view.component.html',
    styleUrls: ['./login-view.component.scss'],
})
export class LoginViewComponent {
    loading: boolean;
    loginFailed: boolean;

    readonly form = new FormGroup({
        username: new FormControl(null, Validators.required),
        password: new FormControl(null, Validators.required),
    });

    constructor(private store: Store, private router: Router) {}

    onLogin() {
        for (const i in this.form.controls) {
            if (this.form.controls.hasOwnProperty(i)) {
                this.form.controls[i].markAsDirty();
                this.form.controls[i].updateValueAndValidity();
            }
        }

        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        const { username, password } = this.form.value;
        this.store.dispatch(new Login(username, password)).subscribe(
            _ => this.router.navigate(['/schedule']),
            _ => {
                this.loading = false;
                this.loginFailed = true;
            }
        );
    }

    onLoginFailedAlertClosed() {
        this.loginFailed = false;
    }
}
