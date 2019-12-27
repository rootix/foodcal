import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthState } from 'src/app/shared/state/auth';

@Component({
    selector: 'fc-shell',
    templateUrl: './shell.component.html'
})
export class ShellComponent {
    @Select(AuthState.isAuthenticated) isAuthenticated$: Observable<boolean>;
}
