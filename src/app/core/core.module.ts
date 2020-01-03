import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { ShellComponent } from './components/shell/shell.component';
import { LoginViewComponent } from './views/login-view/login-view.component';

@NgModule({
    imports: [SharedModule, RouterModule],
    declarations: [ShellComponent, LoginViewComponent],
    exports: [ShellComponent, LoginViewComponent]
})
export class CoreModule {}
