import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';

import { ConfirmDialogComponent } from './dialog/confirm-dialog/confirm-dialog.component';
import { DayNamePipe } from './pipes/day-name.pipe';

const RELAY_IMPORTS = [CommonModule, ClarityModule, PortalModule];

@NgModule({
    declarations: [ConfirmDialogComponent, DayNamePipe],
    imports: [...RELAY_IMPORTS],
    exports: [...RELAY_IMPORTS, DayNamePipe]
})
export class SharedModule {}
