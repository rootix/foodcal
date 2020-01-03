import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';

import { Recipe } from '../models';

@Injectable({ providedIn: 'root' })
export class RecipeApiService {
    constructor(private apollo: Apollo) {}

    getAllRecipes() {
        return this.apollo
            .query<{ allRecipesByDeletedFlag: { data: Recipe[] } }>({
                query: gql`
                    query GetAllRecipes {
                        allRecipesByDeletedFlag(_size: 1000, deleted: false) {
                            data {
                                _id
                                name
                                url
                                lastPreparation
                                note
                                tags
                                deleted
                            }
                        }
                    }
                `
            })
            .pipe(map(response => response.data.allRecipesByDeletedFlag.data));
    }

    createRecipe(recipe: Recipe) {
        return this.apollo
            .mutate<{ createRecipe: { _id: string } }>({
                mutation: gql`
                    mutation CreateRecipe($name: String!, $url: String, $note: String, $deleted: Boolean!) {
                        createRecipe(data: { name: $name, url: $url, note: $note, deleted: $deleted }) {
                            _id
                        }
                    }
                `,
                variables: {
                    name: recipe.name,
                    url: recipe.url,
                    note: recipe.note,
                    deleted: recipe.deleted
                }
            })
            .pipe(map(response => response.data.createRecipe._id));
    }

    updateRecipe(recipe: Recipe) {
        return this.apollo
            .mutate<{ updateRecipe: { _ts: number } }>({
                mutation: gql`
                    mutation UpdateRecipe($id: ID!, $name: String!, $url: String, $note: String, $deleted: Boolean!) {
                        updateRecipe(id: $id, data: { name: $name, url: $url, note: $note, deleted: $deleted }) {
                            _ts
                        }
                    }
                `,
                variables: {
                    id: recipe._id,
                    name: recipe.name,
                    url: recipe.url,
                    note: recipe.note,
                    deleted: recipe.deleted
                }
            })
            .pipe(map(response => response.data.updateRecipe._ts));
    }
}
