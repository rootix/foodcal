import { Action, Selector, State, StateContext } from '@ngxs/store';

import { Recipe } from '../models/recipes.model';
import { AddRecipe, DeleteRecipe, EnsureLoadAllRecipes, UpdateRecipe } from './recipe.actions';

interface RecipeStateModel {
    loaded: boolean;
    recipes: Recipe[];
}

@State<RecipeStateModel>({
    name: 'recipes',
    defaults: {
        loaded: false,
        recipes: []
    }
})
export class RecipeState {
    @Selector()
    static getAllRecipes(state: RecipeStateModel) {
        return state.recipes;
    }

    @Action(AddRecipe)
    private addRecipe(context: StateContext<RecipeStateModel>, { recipe }: AddRecipe) {
        const state = context.getState();
        recipe.id = Math.max(0, ...state.recipes.map(r => r.id)) + 1;
        context.setState({ ...state, recipes: [...state.recipes, recipe] });
    }

    @Action(UpdateRecipe)
    private updateRecipe(context: StateContext<RecipeStateModel>, { recipe }: AddRecipe) {
        const state = context.getState();
        context.setState({
            ...state,
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
        context.setState({ ...state, recipes: [...state.recipes.filter(r => r.id !== id)] });
    }

    @Action(EnsureLoadAllRecipes)
    private ensureLoadAllRecipes(context: StateContext<RecipeStateModel>, { recipes }: EnsureLoadAllRecipes) {
        const state = context.getState();
        if (state.loaded) {
            return;
        }

        context.setState({ loaded: true, recipes });
    }
}
