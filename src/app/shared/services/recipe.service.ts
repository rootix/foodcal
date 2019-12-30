import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';

import { Recipe } from '../models';

@Injectable({ providedIn: 'root' })
export class RecipeService {
    constructor(private apollo: Apollo) {}

    getAllRecipes() {
        return this.apollo
            .query<{ allRecipes: { data: Recipe[] } }>({
                query: gql`
                    query GetAllRecipes {
                        allRecipes(_size: 1000) {
                            data {
                                _id
                                name
                                url
                                lastPreparation
                                note
                                tags
                            }
                        }
                    }
                `
            })
            .pipe(map(response => response.data.allRecipes.data));
    }

    createRecipe(recipe: Recipe) {
        return this.apollo
            .mutate<{ createRecipe: { _id: string } }>({
                mutation: gql`
                    mutation CreateRecipe($name: String!, $url: String, $note: String) {
                        createRecipe(data: { name: $name, url: $url, note: $note }) {
                            _id
                        }
                    }
                `,
                variables: {
                    name: recipe.name,
                    url: recipe.url,
                    note: recipe.note
                }
            })
            .pipe(map(response => response.data.createRecipe._id));
    }

    updateRecipe(recipe: Recipe) {
        return this.apollo
            .mutate<{ updateRecipe: { _ts: number } }>({
                mutation: gql`
                    mutation UpdateRecipe($id: ID!, $name: String!, $url: String, $note: String) {
                        updateRecipe(id: $id, data: { name: $name, url: $url, note: $note }) {
                            _ts
                        }
                    }
                `,
                variables: {
                    id: recipe._id,
                    name: recipe.name,
                    url: recipe.url,
                    note: recipe.note
                }
            })
            .pipe(map(response => response.data.updateRecipe._ts));
    }

    deleteRecipe(id: string) {
        return this.apollo
            .mutate<{ deleteRecipe: { _id: string } }>({
                mutation: gql`
                    mutation DeleteRecipe($id: ID!) {
                        deleteRecipe(id: $id) {
                            _id
                        }
                    }
                `,
                variables: {
                    id
                }
            })
            .pipe(map(response => response.data.deleteRecipe._id));
    }
}
