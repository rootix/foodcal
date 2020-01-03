import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { startOfDay } from 'date-fns';
import gql from 'graphql-tag';
import { map, tap } from 'rxjs/operators';

import { Meal, MealType } from '../models/schedule.model';

@Injectable({
    providedIn: 'root'
})
export class ScheduleApiService {
    constructor(private apollo: Apollo) {}

    getMealsOfWeek(startDate: Date, endDate: Date) {
        // TODO: This is a workaround and very inefficient. Only load the relevant Meals!
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
                map(meals => meals.filter(m => m.date <= endDate)),
                tap(meals => console.log('meals3', meals))
            );
    }

    private convertGraphQlMealToMeal(graphQlMeal: any): Meal {
        return {
            _id: graphQlMeal._id,
            date: startOfDay(new Date(graphQlMeal.date)),
            recipe: { _id: graphQlMeal.recipe._id, name: graphQlMeal.recipe.name },
            type: MealType[graphQlMeal.type as string]
        };
    }
}
