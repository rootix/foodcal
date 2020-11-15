import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

import { SharedModule } from '../shared/shared.module';
import { DayContainerComponent } from './components/day-container/day-container.component';
import { MealCardComponent } from './components/meal-card/meal-card.component';
import { MealDialogComponent } from './components/meal-dialog/meal-dialog.component';
import { WeekContainerComponent } from './components/week-container/week-container.component';
import { WeekSelectorComponent } from './components/week-selector/week-selector.component';
import { ScheduleState } from './state/schedule.state';
import { ScheduleViewComponent } from './views/schedule-view/schedule-view.component';

@NgModule({
    imports: [SharedModule, NgxsModule.forFeature([ScheduleState])],
    declarations: [
        ScheduleViewComponent,
        MealCardComponent,
        WeekSelectorComponent,
        DayContainerComponent,
        WeekContainerComponent,
        MealDialogComponent,
    ],
})
export class ScheduleModule {}
