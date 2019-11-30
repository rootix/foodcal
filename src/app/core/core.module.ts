import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShellComponent } from './shell/shell.component';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';

@NgModule({
    imports: [CommonModule, RouterModule, ClarityModule],
    declarations: [ShellComponent],
    exports: [ShellComponent]
})
export class CoreModule {}
