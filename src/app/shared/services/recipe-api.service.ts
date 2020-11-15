import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { isFuture, max, startOfDay } from 'date-fns';
import { map } from 'rxjs/operators';

import { Recipe } from '../models';

@Injectable({ providedIn: 'root' })
export class RecipeApiService {
    constructor(private apollo: Apollo) {}

    getAllRecipes() {
        // TODO: The Join to meals is super inefficient as i only need the newest date. Learn FQL -.-
        return this.apollo
            .query<{ allRecipesByDeletedFlag: { data: Recipe[] } }>({
                query: gql`
                    query GetAllRecipes {
                        allRecipesByDeletedFlag(_size: 1000, deleted: false) {
                            data {
                                _id
                                name
                                url
                                note
                                tags
                                deleted
                                meals(_size: 1000) {
                                    data {
                                        date
                                    }
                                }
                            }
                        }
                    }
                `
            })
            .pipe(
                map(response => response.data.allRecipesByDeletedFlag.data),
                map(graphQlRecipes => graphQlRecipes.map(r => this.convertGraphQlRecipeToRecipe(r)))
            );
    }

    createRecipe(recipe: Recipe) {
        return this.apollo
            .mutate<{ createRecipe: { _id: string } }>({
                mutation: gql`
                    mutation CreateRecipe(
                        $name: String!
                        $url: String
                        $note: String
                        $deleted: Boolean!
                        $tags: [String!]
                    ) {
                        createRecipe(data: { name: $name, url: $url, note: $note, deleted: $deleted, tags: $tags }) {
                            _id
                        }
                    }
                `,
                variables: {
                    name: recipe.name,
                    url: recipe.url,
                    note: recipe.note,
                    deleted: recipe.deleted || false,
                    tags: recipe.tags || []
                }
            })
            .pipe(map(response => response.data.createRecipe._id));
    }

    updateRecipe(recipe: Recipe) {
        return this.apollo
            .mutate<{ updateRecipe: { _ts: number } }>({
                mutation: gql`
                    mutation UpdateRecipe(
                        $id: ID!
                        $name: String!
                        $url: String
                        $note: String
                        $deleted: Boolean!
                        $tags: [String!]
                    ) {
                        updateRecipe(
                            id: $id
                            data: { name: $name, url: $url, note: $note, deleted: $deleted, tags: $tags }
                        ) {
                            _ts
                        }
                    }
                `,
                variables: {
                    id: recipe._id,
                    name: recipe.name,
                    url: recipe.url,
                    note: recipe.note,
                    deleted: recipe.deleted || false,
                    tags: recipe.tags || []
                }
            })
            .pipe(map(response => response.data.updateRecipe._ts));
    }

    private convertGraphQlRecipeToRecipe(graphQlRecipe: any): Recipe {
        return {
            _id: graphQlRecipe._id,
            name: graphQlRecipe.name,
            url: graphQlRecipe.url,
            lastPreparation: this.getNewestNonFutureDateFromGraphQlDates(graphQlRecipe.meals.data.map(d => d.date)),
            note: graphQlRecipe.note,
            tags: graphQlRecipe.tags,
            deleted: graphQlRecipe.deleted
        };
    }

    private getNewestNonFutureDateFromGraphQlDates(datesAsString: string[]): Date {
        if (datesAsString == null || !datesAsString.length) {
            return null;
        }

        const parsedDates = datesAsString.map(d => startOfDay(new Date(d)));
        const datesNotInFuture = parsedDates.filter(d => !isFuture(d));
        if (!datesNotInFuture.length) {
            return null;
        }

        return max(datesNotInFuture);
    }
}
