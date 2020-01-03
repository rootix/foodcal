import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { patch, removeItem } from '@ngxs/store/operators';
import { map, tap } from 'rxjs/operators';

import { Recipe } from '../../models/recipes.model';
import { RecipeService } from '../../services/recipe.service';
import {
    AddRecipe,
    DeleteRecipe,
    EnsureLoadAllRecipes,
    RecipeLoaded as RecipesLoaded,
    RecipeLoading as RecipesLoading,
    UpdateRecipe,
} from './recipe.actions';

interface RecipeStateModel {
    loaded: boolean;
    loading: boolean;
    recipes: Recipe[];
}

@State<RecipeStateModel>({
    name: 'recipes',
    defaults: {
        loaded: false,
        loading: false,
        recipes: []
    }
})
@Injectable()
export class RecipeState {
    @Selector()
    static getAllRecipes(state: RecipeStateModel) {
        return state.recipes;
    }

    @Selector()
    static loading({ loading }: RecipeStateModel) {
        return loading;
    }

    constructor(private recipeService: RecipeService) {}

    @Action(AddRecipe)
    private addRecipe(context: StateContext<RecipeStateModel>, { recipe }: AddRecipe) {
        const currentState = context.getState();
        return this.recipeService.createRecipe(recipe).pipe(
            map(id => Object.assign({}, recipe, { _id: id } as Recipe)),
            tap(newRecipe => {
                context.patchState({ recipes: [...currentState.recipes, newRecipe] });
            })
        );
    }

    @Action(UpdateRecipe)
    private updateRecipe(context: StateContext<RecipeStateModel>, { recipe }: AddRecipe) {
        const state = context.getState();
        return this.recipeService.updateRecipe(recipe).pipe(
            tap(timestamp =>
                context.patchState({
                    recipes: [
                        ...state.recipes.map(r => {
                            if (r._id === recipe._id) {
                                return Object.assign({}, r, recipe, { _ts: timestamp });
                            }
                            return r;
                        })
                    ]
                })
            )
        );
    }

    @Action(DeleteRecipe)
    private deleteRecipe(context: StateContext<RecipeStateModel>, { id }: DeleteRecipe) {
        return this.recipeService
            .deleteRecipe(id)
            .pipe(
                tap(deletedId =>
                    context.setState(patch({ recipes: removeItem<Recipe>(recipe => recipe._id === deletedId) }))
                )
            );
    }

    @Action(EnsureLoadAllRecipes)
    private ensureLoadAllRecipes(context: StateContext<RecipeStateModel>) {
        const state = context.getState();
        if (state.loaded) {
            return context.dispatch(new RecipesLoaded());
        }

        return this.recipeService.getAllRecipes().pipe(
            tap(recipes => context.patchState({ loaded: true, recipes })),
            tap(_ => context.dispatch(new RecipesLoaded()))
        );
    }

    @Action(RecipesLoading)
    private recipesLoading(context: StateContext<RecipeStateModel>) {
        context.patchState({ loading: true });
    }

    @Action(RecipesLoaded)
    private recipesLoaded(context: StateContext<RecipeStateModel>) {
        context.patchState({ loading: false });
    }
}
