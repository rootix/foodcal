import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { Login, Logout } from './auth.actions';

export interface AuthStateModel {
    token: string | null;
}

@State<AuthStateModel>({
    name: 'auth',
    defaults: {
        token: null,
    },
})
@Injectable()
export class AuthState {
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

    constructor(private authService: AuthService) {}
}
