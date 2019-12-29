import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthState, Logout } from 'src/app/shared/state/auth';

@Component({
    selector: 'fc-shell',
    templateUrl: './shell.component.html'
})
export class ShellComponent {
    @Select(AuthState.isAuthenticated) isAuthenticated$: Observable<boolean>;

    constructor(private store: Store, private router: Router) {}

    onLogout() {
        this.store.dispatch(new Logout()).subscribe(_ => {
            // TODO: Move this to a class which handles ofActionSuccessful(Logout)
            this.router.navigate(['/login']);
        });
    }
}
