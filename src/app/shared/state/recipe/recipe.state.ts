import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { append, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { map, tap } from 'rxjs/operators';

import { Recipe } from '../../models/recipes.model';
import { RecipeApiService } from '../../services/recipe-api.service';
import {
    CreateRecipe,
    DeleteRecipe,
    EnsureLoadAllRecipes,
    RecalculateTags,
    RecipeLoaded as RecipesLoaded,
    RecipeLoading as RecipesLoading,
    UpdateRecipe,
} from './recipe.actions';

interface RecipeStateModel {
    loaded: boolean;
    loading: boolean;
    recipes: Recipe[];
    tags: string[];
}

@State<RecipeStateModel>({
    name: 'recipes',
    defaults: {
        loaded: false,
        loading: false,
        recipes: [],
        tags: [],
    },
})
@Injectable()
export class RecipeState {
    @Selector()
    static getAllRecipes(state: RecipeStateModel) {
        return state.recipes;
    }

    @Selector()
    static getTags({ tags }: RecipeStateModel) {
        return tags;
    }

    @Selector()
    static loading({ loading }: RecipeStateModel) {
        return loading;
    }

    constructor(private recipeService: RecipeApiService) {}

    @Action(CreateRecipe)
    private createRecipe(context: StateContext<RecipeStateModel>, { recipe }: CreateRecipe) {
        return this.recipeService.createRecipe(recipe).pipe(
            map(id => Object.assign({}, recipe, { _id: id } as Recipe)),
            tap(newRecipe => {
                context.setState(patch({ recipes: append([newRecipe]) }));
            }),
            tap(_ => context.dispatch(new RecalculateTags()))
        );
    }

    @Action(UpdateRecipe)
    private updateRecipe(context: StateContext<RecipeStateModel>, { recipe }: CreateRecipe) {
        return this.recipeService.updateRecipe(recipe).pipe(
            tap(timestamp =>
                context.setState(
                    patch({
                        recipes: updateItem(
                            (r: Recipe) => r._id === recipe._id,
                            patch(Object.assign({}, recipe, { _ts: timestamp } as Recipe))
                        ),
                    })
                )
            ),
            tap(_ => context.dispatch(new RecalculateTags()))
        );
    }

    @Action(DeleteRecipe)
    private deleteRecipe(context: StateContext<RecipeStateModel>, { recipe }: DeleteRecipe) {
        return this.recipeService.updateRecipe(Object.assign({}, recipe, { deleted: true })).pipe(
            tap(timestamp => context.setState(patch({ recipes: removeItem<Recipe>(r => r._id === recipe._id) }))),
            tap(_ => context.dispatch(new RecalculateTags()))
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
            tap(_ => context.dispatch([new RecipesLoaded(), new RecalculateTags()]))
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

    @Action(RecalculateTags)
    private recalculateTags(context: StateContext<RecipeStateModel>) {
        const allTags: string[] = [];
        const tagsPerRecipe = context.getState().recipes.map(r => r.tags || []);
        for (const tags of tagsPerRecipe) {
            for (const tag of tags) {
                if (allTags.indexOf(tag) === -1) {
                    allTags.push(tag);
                }
            }
        }

        context.patchState({ tags: allTags.sort() });
    }
}
