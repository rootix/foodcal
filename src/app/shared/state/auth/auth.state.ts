import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import { Login, Logout } from './auth.actions';

export interface AuthStateModel {
    token: string | null;
}

@State<AuthStateModel>({
    name: 'auth',
    defaults: {
        token: null
    }
})
@Injectable()
export class AuthState {
    constructor(private authService: AuthService) {}

    @Selector()
    static token(state: AuthStateModel): string | null {
        return state.token;
    }

    @Selector()
    static isAuthenticated(state: AuthStateModel) {
        return !!state.token;
    }

    @Action(Login)
    login(ctx: StateContext<AuthStateModel>, action: Login) {
        return this.authService.login(action.username, action.password).pipe(tap(token => ctx.patchState({ token })));
    }

    @Action(Logout)
    logout(ctx: StateContext<AuthStateModel>) {
        ctx.patchState({ token: null });
    }
}
