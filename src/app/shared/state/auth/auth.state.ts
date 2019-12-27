import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import { Login } from './auth.actions';

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
        return ctx.patchState({ token: 'abcd' });
    }
}
