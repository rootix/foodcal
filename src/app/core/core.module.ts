import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { ShellComponent } from './shell/shell.component';

@NgModule({
    imports: [SharedModule, RouterModule],
    declarations: [ShellComponent],
    exports: [ShellComponent]
})
export class CoreModule {}
