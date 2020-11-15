import { Recipe } from 'src/app/shared/models';

export enum MealType {
    Lunch,
    Dinner,
}
export interface Meal {
    _id?: string;
    date: Date;
    type: MealType;
    recipe?: Recipe;
    notes?: string;
    _ts?: number;
}

export interface Week {
    calendarWeek: number;
    isCurrentWeek: boolean;
    startDate: Date;
    endDate: Date;
}

export interface MealsPerDay {
    date: Date;
    meals: Meal[];
}
