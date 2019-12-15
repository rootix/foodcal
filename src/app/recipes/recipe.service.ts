import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';

import { RECIPE_MOCKS } from './models/recipes.mock';
import { Recipe } from './models/recipes.model';
import { AddRecipe, DeleteRecipe, EnsureLoadAllRecipes, RecipeLoading, UpdateRecipe } from './state/recipe.actions';
import { RecipeState } from './state/recipe.state';

@Injectable({ providedIn: 'root' })
export class RecipeService {
    @Select(RecipeState.getAllRecipes) public recipes$: Observable<Recipe[]>;
    @Select(RecipeState.loading) public loading$: Observable<Recipe[]>;

    constructor(private store: Store) {}

    public addRecipe(recipe: Recipe) {
        return of(true).pipe(
            delay(1000),
            switchMap(_ => this.store.dispatch(new AddRecipe(recipe)))
        );
    }

    public updateRecipe(recipe: Recipe) {
        return of(true).pipe(
            delay(1000),
            switchMap(_ => this.store.dispatch(new UpdateRecipe(recipe)))
        );
    }

    public deleteRecipe(recipe: Recipe) {
        return of(true).pipe(
            delay(1000),
            switchMap(_ => this.store.dispatch(new DeleteRecipe(recipe.id)))
        );
    }

    public ensureLoadRecipes() {
        this.store.dispatch(new RecipeLoading());
        of(true)
            .pipe(
                delay(1000),
                switchMap(_ => this.store.dispatch(new EnsureLoadAllRecipes(RECIPE_MOCKS)))
            )
            .subscribe();
    }
}
