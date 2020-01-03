import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { DialogService } from 'src/app/shared/dialog/dialog.service';

import { MealsPerDay, Week } from '../../models/schedule.model';
import { EnsureInitializeSchedule, SwitchToNextWeek, SwitchToPreviousWeek } from '../../state/schedule.actions';
import { ScheduleState } from '../../state/schedule.state';

@Component({
    selector: 'fc-schedule-view',
    templateUrl: './schedule-view.component.html'
})
export class ScheduleViewComponent implements OnInit {
    @Select(ScheduleState.week) public week$: Observable<Week>;
    @Select(ScheduleState.mealsOfWeek) public mealsOfWeek$: Observable<MealsPerDay[]>;
    @Select(ScheduleState.loading) public loading$: Observable<boolean>;

    constructor(private store: Store, private dialogService: DialogService) {}

    ngOnInit() {
        this.store.dispatch(new EnsureInitializeSchedule());
    }

    onSwitchToNextWeek() {
        this.store.dispatch(new SwitchToNextWeek());
    }

    onSwitchToPreviousWeek() {
        this.store.dispatch(new SwitchToPreviousWeek());
    }
}
