import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';

const RELAY_IMPORTS = [CommonModule, ClarityModule];
@NgModule({
    imports: [...RELAY_IMPORTS],
    exports: [...RELAY_IMPORTS]
})
export class SharedModule {}
