import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClrForm, ClrLoadingState } from '@clr/angular';
import { Store } from '@ngxs/store';
import { Login } from 'src/app/shared/state/auth';

@Component({
    selector: 'fc-login-view',
    templateUrl: './login-view.component.html',
    styleUrls: ['./login-view.component.scss']
})
export class LoginViewComponent {
    @ViewChild(ClrForm) clarityForm: ClrForm;
    loginLoadingState: ClrLoadingState;

    readonly form = new FormGroup({
        username: new FormControl(null, Validators.required),
        password: new FormControl(null, Validators.required)
    });

    constructor(private store: Store, private router: Router) {}

    onLogin() {
        if (this.form.invalid) {
            this.clarityForm.markAsTouched();
            return;
        }

        this.loginLoadingState = ClrLoadingState.LOADING;
        const { username, password } = this.form.value;
        this.store.dispatch(new Login(username, password)).subscribe(
            _ => this.router.navigate(['/schedule']),
            _ => {
                this.loginLoadingState = ClrLoadingState.ERROR;
                console.log('login failed', _);
            }
        );
    }
}
