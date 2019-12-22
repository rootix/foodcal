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
