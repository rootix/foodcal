import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { addDays, eachDayOfInterval, getWeek, startOfWeek } from 'date-fns';
import { map, mergeMap, switchMap, tap } from 'rxjs/operators';

import { Meal, MealsPerDay, MealType, Week } from '../models/schedule.model';
import { ScheduleApiService } from '../services/schedule-api.service';
import { LoadMealsOfWeek, SwitchToNextWeek, SwitchToPreviousWeek, WeekLoaded, WeekLoading } from './schedule.actions';

interface ScheduleStateModel {
    loading: boolean;
    week: Week;
    mealsOfWeek: MealsPerDay[];
}

@State<ScheduleStateModel>({
    name: 'schedule',
    defaults: {
        loading: false,
        week: null,
        mealsOfWeek: []
    }
})
@Injectable()
export class ScheduleState implements NgxsOnInit {
    @Selector()
    static week(state: ScheduleStateModel) {
        return state.week;
    }

    @Selector()
    static mealsOfWeek(state: ScheduleStateModel) {
        return state.mealsOfWeek;
    }

    @Selector()
    static loading(state: ScheduleStateModel) {
        return state.loading;
    }

    constructor(private scheduleApiService: ScheduleApiService) {}

    ngxsOnInit(ctx: StateContext<ScheduleStateModel>) {
        const currentWeek = this.getCurrentWeek();
        ctx.patchState({ week: currentWeek });
        return ctx.dispatch(new LoadMealsOfWeek(currentWeek.startDate, currentWeek.endDate));
    }

    @Action(SwitchToNextWeek)
    private switchToNextWeek(ctx: StateContext<ScheduleStateModel>) {
        const currentStartDate = ctx.getState().week.startDate;
        const nextWeekStartDate = addDays(currentStartDate, 7);
        const nextWeek = this.getWeekForDate(nextWeekStartDate);
        ctx.patchState({ week: nextWeek });
        return ctx.dispatch(new LoadMealsOfWeek(nextWeek.startDate, nextWeek.endDate));
    }

    @Action(SwitchToPreviousWeek)
    private switchToPreviousWeek(ctx: StateContext<ScheduleStateModel>) {
        const currentStartDate = ctx.getState().week.startDate;
        const previousWeekStartDate = addDays(currentStartDate, -7);
        const previousWeek = this.getWeekForDate(previousWeekStartDate);
        ctx.patchState({ week: previousWeek });
        return ctx.dispatch(new LoadMealsOfWeek(previousWeek.startDate, previousWeek.endDate));
    }

    @Action(LoadMealsOfWeek)
    private loadMealsOfWeek(ctx: StateContext<ScheduleStateModel>, payload: LoadMealsOfWeek) {
        return ctx.dispatch(new WeekLoading()).pipe(
            switchMap(_ => this.scheduleApiService.getMealsOfWeek(payload.startDate, payload.endDate)),
            map(existingMeals => this.buildCompleteMealsOfWeek(payload.startDate, payload.endDate, existingMeals)),
            tap(meals => ctx.patchState({ mealsOfWeek: meals })),
            mergeMap(_ => ctx.dispatch(new WeekLoaded()))
        );
    }

    @Action(WeekLoading)
    private weekLoading(ctx: StateContext<ScheduleStateModel>) {
        ctx.patchState({ loading: true });
    }

    @Action(WeekLoaded)
    private weekLoaded(ctx: StateContext<ScheduleStateModel>) {
        ctx.patchState({ loading: false });
    }

    private getCurrentWeek() {
        return this.getWeekForDate(new Date());
    }

    private getWeekForDate(date: Date) {
        const monday = startOfWeek(date, { weekStartsOn: 1 });
        const sunday = addDays(monday, 6);
        const calendarWeek = this.getWeek(date);
        const isCurrentWeek = this.getWeek(new Date()) === calendarWeek;
        return {
            startDate: monday,
            endDate: sunday,
            calendarWeek,
            isCurrentWeek
        } as Week;
    }

    private getWeek(date: Date) {
        return getWeek(date, { weekStartsOn: 1 });
    }

    private buildCompleteMealsOfWeek(startDate: Date, endDate: Date, existingMeals: Meal[]) {
        const mealsPerDay: MealsPerDay[] = [];
        const interval = eachDayOfInterval({ start: startDate, end: endDate });
        interval.forEach((date: Date) => {
            const lunch = existingMeals.find(m => m.date.getTime() === date.getTime() && m.type === MealType.Lunch) || {
                date,
                type: MealType.Lunch
            };

            const dinner = existingMeals.find(
                m => m.date.getTime() === date.getTime() && m.type === MealType.Dinner
            ) || {
                date,
                type: MealType.Dinner
            };

            const day: MealsPerDay = {
                date,
                meals: [lunch, dinner]
            };

            mealsPerDay.push(day);
        });

        return mealsPerDay;
    }
}
