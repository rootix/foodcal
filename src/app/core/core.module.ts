import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { SharedModule } from '../shared/shared.module';
import { ShellComponent } from './components/shell/shell.component';
import { LoginViewComponent } from './views/login-view/login-view.component';

@NgModule({
    imports: [SharedModule, RouterModule, NzLayoutModule, NzMenuModule],
    declarations: [ShellComponent, LoginViewComponent],
    exports: [ShellComponent, LoginViewComponent],
})
export class CoreModule {}
