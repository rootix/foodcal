import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { MealsPerDay, Week } from './models/schedule.model';
import { SwitchToNextWeek, SwitchToPreviousWeek } from './state/schedule.actions';
import { ScheduleState } from './state/schedule.state';

@Injectable({
    providedIn: 'root'
})
export class ScheduleService {
    @Select(ScheduleState.week) public week$: Observable<Week>;
    @Select(ScheduleState.mealsOfWeek) public mealsOfWeek$: Observable<MealsPerDay[]>;
    @Select(ScheduleState.loading) public loading$: Observable<boolean>;

    constructor(private store: Store) {}

    switchToNextWeek() {
        return this.store.dispatch(new SwitchToNextWeek());
    }

    switchToPreviousWeek() {
        return this.store.dispatch(new SwitchToPreviousWeek());
    }
}
