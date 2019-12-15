import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogService } from 'src/app/shared/dialog/dialog.service';

import { RecipeDialogComponent } from '../../components/recipe-dialog/recipe-dialog.component';
import { Recipe } from '../../models/recipes.model';
import { RecipeService } from '../../recipe.service';

@Component({
    selector: 'fc-recipes-view',
    templateUrl: './recipes-view.component.html'
})
export class RecipesViewComponent implements OnInit {
    @ViewChild(RecipeDialogComponent) dialog: RecipeDialogComponent;

    recipes$ = this.recipeService.recipes$;
    loading$ = this.recipeService.loading$;

    constructor(private recipeService: RecipeService, private dialogService: DialogService) {}

    ngOnInit() {
        this.recipeService.ensureLoadRecipes();
    }

    onAddRecipe() {
        this.dialog.open({} as Recipe, r => this.recipeService.addRecipe(r));
    }

    onEditRecipe(recipe: Recipe) {
        this.dialog.open(recipe, r => this.recipeService.updateRecipe(r));
    }

    onDeleteRecipe(recipe: Recipe) {
        this.dialogService
            .confirm(
                'Bestätigen',
                'Soll das Rezept wirklich gelöscht werden?',
                () => this.recipeService.deleteRecipe(recipe),
                'Löschen',
                'btn-danger'
            )
            .subscribe();
    }
}
