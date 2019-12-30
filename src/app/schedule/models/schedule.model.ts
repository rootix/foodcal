import { Recipe } from 'src/app/shared/models';

export enum MealType {
    Lunch,
    Dinner
}
export interface Meal {
    id?: number;
    date: Date;
    type: MealType;
    recipe?: Recipe;
    notes?: string;
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
