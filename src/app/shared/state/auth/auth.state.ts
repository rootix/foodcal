import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import { Login, Logout } from './auth.actions';
import { AuthStateModel } from './auth.model';

@State<AuthStateModel>({
    name: 'auth',
    defaults: {
        userId: null,
        token: null
    }
})
@Injectable()
export class AuthState {
    constructor(private authService: AuthService) {}

    @Selector()
    static userId(state: AuthStateModel) {
        return state.userId;
    }

    @Selector()
    static token(state: AuthStateModel) {
        return state.token;
    }

    @Selector()
    static isAuthenticated(state: AuthStateModel) {
        return !!state.userId && !!state.token;
    }

    @Action(Login)
    login(ctx: StateContext<AuthStateModel>, action: Login) {
        return this.authService.login(action.username, action.password).pipe(
            tap(response => {
                ctx.patchState(response);
            })
        );
    }

    @Action(Logout)
    logout(ctx: StateContext<AuthStateModel>) {
        const { token } = ctx.getState();
        if (token == null) {
            return of(false);
        }

        return this.authService.logout(token).pipe(
            tap(_ => {
                ctx.patchState({ token: null });
            })
        );
    }
}
