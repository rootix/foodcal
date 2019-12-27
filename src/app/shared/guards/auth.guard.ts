import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngxs/store';

import { AuthState } from '../state/auth';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private store: Store, private router: Router) {}

    canActivate() {
        const isAuthenticated = this.store.selectSnapshot(AuthState.isAuthenticated);
        if (isAuthenticated) {
            return true;
        }

        this.router.navigate(['/login']);
        return false;
    }
}
