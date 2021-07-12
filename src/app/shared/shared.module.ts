import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { DayNamePipe } from './pipes/day-name.pipe';

const RELAY_IMPORTS = [
    CommonModule,
    PortalModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzGridModule,
    NzModalModule,
    NzFormModule,
    NzSpinModule,
    NzSelectModule,
    NzAlertModule,
    NzCardModule,
    NzInputModule,
    NzIconModule,
];

@NgModule({
    declarations: [DayNamePipe],
    imports: [...RELAY_IMPORTS],
    exports: [...RELAY_IMPORTS, DayNamePipe],
})
export class SharedModule {}
