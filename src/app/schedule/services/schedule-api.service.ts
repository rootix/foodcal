import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Apollo } from 'apollo-angular';
import { format, startOfDay } from 'date-fns';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { AuthState } from 'src/app/shared/state/auth';

import { Meal, MealType } from '../models/schedule.model';

@Injectable({
    providedIn: 'root'
})
export class ScheduleApiService {
    constructor(private apollo: Apollo, private store: Store) {}

    getMealsOfWeek(startDate: Date, endDate: Date) {
        // TODO: This is a workaround and very inefficient. Only load the relevant Meals! P.S. Apollo caching rocks :D
        return this.apollo
            .query<{ allMeals: { data: any[] } }>({
                query: gql`
                    query GetAllMeals {
                        allMeals(_size: 1000) {
                            data {
                                _id
                                date
                                recipe {
                                    _id
                                    name
                                }
                                type
                                notes
                            }
                        }
                    }
                `
            })
            .pipe(
                map(response => response.data.allMeals.data),
                map(graphQlMeals => graphQlMeals.map(m => this.convertGraphQlMealToMeal(m))),
                map(meals => meals.filter(m => m.date >= startDate)),
                map(meals => meals.filter(m => m.date <= endDate))
            );
    }

    createMeal(meal: Meal) {
        return this.apollo
            .mutate<{ createMeal: { _id: string } }>({
                mutation: gql`
                    mutation CreateMeal(
                        $date: Date!
                        $type: MealType!
                        $recipe: MealRecipeRelation!
                        $notes: String
                        $owner: MealOwnerRelation!
                    ) {
                        createMeal(data: { date: $date, type: $type, recipe: $recipe, notes: $notes, owner: $owner }) {
                            _id
                        }
                    }
                `,
                variables: {
                    date: format(meal.date, 'yyyy-MM-dd'),
                    type: MealType[meal.type],
                    recipe: { connect: meal.recipe._id },
                    notes: meal.notes,
                    owner: { connect: this.store.selectSnapshot(AuthState.userId) }
                }
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
                        $owner: MealOwnerRelation!
                    ) {
                        updateMeal(
                            id: $id
                            data: { date: $date, type: $type, recipe: $recipe, notes: $notes, owner: $owner }
                        ) {
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
                    owner: { connect: this.store.selectSnapshot(AuthState.userId) }
                }
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
                    id
                }
            })
            .pipe(map(response => response.data.deleteMeal._id));
    }

    private convertGraphQlMealToMeal(graphQlMeal: any): Meal {
        return {
            _id: graphQlMeal._id,
            date: startOfDay(new Date(graphQlMeal.date)),
            recipe: { _id: graphQlMeal.recipe._id, name: graphQlMeal.recipe.name },
            type: MealType[graphQlMeal.type as string],
            notes: graphQlMeal.notes
        };
    }
}
