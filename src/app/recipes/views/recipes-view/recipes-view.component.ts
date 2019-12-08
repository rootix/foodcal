import { Component, ViewChild } from '@angular/core';

import { RecipeDialogComponent } from '../../components/recipe-dialog/recipe-dialog.component';
import { RECIPE_MOCKS } from '../../models/recipes.mock';
import { Recipe } from '../../models/recipes.model';

@Component({
    selector: 'fc-recipes-view',
    templateUrl: './recipes-view.component.html'
})
export class RecipesViewComponent {
    @ViewChild(RecipeDialogComponent) dialog: RecipeDialogComponent;

    readonly recipes = RECIPE_MOCKS;

    onAddRecipe() {
        this.dialog.open();
    }

    onEditRecipe(recipe: Recipe) {
        this.dialog.open(recipe);
    }
}
