import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';

import { ConfirmDialogComponent } from './dialog/confirm-dialog/confirm-dialog.component';

const RELAY_IMPORTS = [CommonModule, ClarityModule, PortalModule];
@NgModule({
    declarations: [ConfirmDialogComponent],
    imports: [...RELAY_IMPORTS],
    exports: [...RELAY_IMPORTS],
    entryComponents: [ConfirmDialogComponent]
})
export class SharedModule {}
