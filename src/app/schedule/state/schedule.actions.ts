import { Meal } from '../models/schedule.model';

export class SwitchToNextWeek {
    static readonly type = '[Schedule] Switch To Next Week';
}

export class SwitchToPreviousWeek {
    static readonly type = '[Schedule] Switch To Previous Week';
}

export class WeekLoading {
    static readonly type = '[Schedule] Week Loading';
}

export class WeekLoaded {
    static readonly type = '[Schedule] Week Loaded';
}

export class LoadMealsOfWeek {
    static readonly type = '[Schedule] Load Meals Of Week';
    constructor(public startDate: Date, public endDate: Date) {}
}

export class CreateMeal {
    static readonly type = '[Schedule] Create Meal';
    constructor(public meal: Meal) {}
}

export class UpdateMeal {
    static readonly type = '[Schedule] Update Meal';
    constructor(public meal: Meal) {}
}

export class DeleteMeal {
    static readonly type = '[Schedule] Delete Meal';
    constructor(public id: string) {}
}

export class EnsureInitializeSchedule {
    static readonly type = '[Schedule] Ensure Initialize Schedule';
}
