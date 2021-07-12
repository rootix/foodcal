import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { differenceInCalendarDays, format, startOfDay } from 'date-fns';
import { map } from 'rxjs/operators';
import { Meal, MealType } from '../models/schedule.model';

@Injectable({
    providedIn: 'root',
})
export class ScheduleApiService {
    constructor(private apollo: Apollo) {}

    getMealsOfWeek(startDate: Date, endDate: Date) {
        const maxNumberOfMeals = (differenceInCalendarDays(endDate, startDate) + 1) * 2;
        return this.apollo
            .query<{ allMealsInDateRange: { data: any[] } }>({
                query: gql`
                    query GetMealsOfWeek($from: Date!, $to: Date!, $size: Int!) {
                        allMealsInDateRange(from: $from, to: $to, _size: $size) {
                            data {
                                _id
                                date
                                recipe {
                                    _id
                                    name
                                    url
                                }
                                type
                                notes
                            }
                        }
                    }
                `,
                variables: {
                    from: format(startDate, 'yyyy-MM-dd'),
                    to: format(endDate, 'yyyy-MM-dd'),
                    size: maxNumberOfMeals,
                },
            })
            .pipe(
                map(response => response.data.allMealsInDateRange.data),
                map(graphQlMeals => graphQlMeals.map(m => this.convertGraphQlMealToMeal(m))),
                map(meals => meals.filter(m => m.date >= startDate)),
                map(meals => meals.filter(m => m.date <= endDate))
            );
    }

    createMeal(meal: Meal) {
        return this.apollo
            .mutate<{ createMeal: { _id: string } }>({
                mutation: gql`
                    mutation CreateMeal($date: Date!, $type: MealType!, $recipe: MealRecipeRelation!, $notes: String) {
                        createMeal(data: { date: $date, type: $type, recipe: $recipe, notes: $notes }) {
                            _id
                        }
                    }
                `,
                variables: {
                    date: format(meal.date, 'yyyy-MM-dd'),
                    type: MealType[meal.type],
                    recipe: { connect: meal.recipe._id },
                    notes: meal.notes,
                },
            })
            .pipe(map(response => response.data.createMeal._id));
    }

    updateMeal(meal: Meal) {
        return this.apollo
            .mutate<{ updateMeal: { _ts: number } }>({
                mutation: gql`
                    mutation UpdateMeal(
                        $id: ID!
                        $date: Date!
                        $type: MealType!
                        $recipe: MealRecipeRelation!
                        $notes: String
                    ) {
                        updateMeal(id: $id, data: { date: $date, type: $type, recipe: $recipe, notes: $notes }) {
                            _ts
                        }
                    }
                `,
                variables: {
                    id: meal._id,
                    date: format(meal.date, 'yyyy-MM-dd'),
                    type: MealType[meal.type],
                    recipe: { connect: meal.recipe._id },
                    notes: meal.notes,
                },
            })
            .pipe(map(response => response.data.updateMeal._ts));
    }

    deleteMeal(id: string) {
        return this.apollo
            .mutate<{ deleteMeal: { _id: string } }>({
                mutation: gql`
                    mutation DeleteMeal($id: ID!) {
                        deleteMeal(id: $id) {
                            _id
                        }
                    }
                `,
                variables: {
                    id,
                },
            })
            .pipe(map(response => response.data.deleteMeal._id));
    }

    private convertGraphQlMealToMeal(graphQlMeal: any): Meal {
        return {
            _id: graphQlMeal._id,
            date: startOfDay(new Date(graphQlMeal.date)),
            recipe: { _id: graphQlMeal.recipe._id, name: graphQlMeal.recipe.name, url: graphQlMeal.recipe.url },
            type: MealType[graphQlMeal.type as string],
            notes: graphQlMeal.notes,
        };
    }
}
