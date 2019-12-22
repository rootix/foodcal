import { Component } from '@angular/core';

import { ScheduleService } from '../../schedule.service';

@Component({
    selector: 'fc-schedule-view',
    templateUrl: './schedule-view.component.html'
})
export class ScheduleViewComponent {
    readonly week$ = this.scheduleService.week$;
    readonly mealsOfWeek$ = this.scheduleService.mealsOfWeek$;
    readonly loading$ = this.scheduleService.loading$;

    constructor(private scheduleService: ScheduleService) {}

    onSwitchToNextWeek() {
        this.scheduleService.switchToNextWeek().subscribe();
    }

    onSwitchToPreviousWeek() {
        this.scheduleService.switchToPreviousWeek().subscribe();
    }
}
