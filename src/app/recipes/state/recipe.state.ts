import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import { Recipe } from '../models/recipes.model';
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

    @Action(AddRecipe)
    private addRecipe(context: StateContext<RecipeStateModel>, { recipe }: AddRecipe) {
        const state = context.getState();
        recipe.id = Math.max(0, ...state.recipes.map(r => r.id)) + 1;
        context.patchState({ recipes: [...state.recipes, recipe] });
    }

    @Action(UpdateRecipe)
    private updateRecipe(context: StateContext<RecipeStateModel>, { recipe }: AddRecipe) {
        const state = context.getState();
        context.patchState({
            recipes: [
                ...state.recipes.map(r => {
                    if (r.id === recipe.id) {
                        return Object.assign({}, r, recipe);
                    }
                    return r;
                })
            ]
        });
    }

    @Action(DeleteRecipe)
    private deleteRecipe(context: StateContext<RecipeStateModel>, { id }: DeleteRecipe) {
        const state = context.getState();
        context.patchState({ recipes: [...state.recipes.filter(r => r.id !== id)] });
    }

    @Action(EnsureLoadAllRecipes)
    private ensureLoadAllRecipes(context: StateContext<RecipeStateModel>, { recipes }: EnsureLoadAllRecipes) {
        const state = context.getState();
        if (state.loaded) {
            return context.dispatch(new RecipesLoaded());
        }

        context.patchState({ loaded: true, recipes });
        return context.dispatch(new RecipesLoaded());
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
