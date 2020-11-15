import { Component, OnInit, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { DialogService } from 'src/app/shared/dialog/dialog.service';
import { Recipe } from 'src/app/shared/models';
import {
    CreateRecipe,
    DeleteRecipe,
    EnsureLoadAllRecipes,
    RecipeState,
    UpdateRecipe,
} from 'src/app/shared/state/recipe';

import { RecipeDialogComponent } from '../../components/recipe-dialog/recipe-dialog.component';

@Component({
    selector: 'fc-recipes-view',
    templateUrl: './recipes-view.component.html',
})
export class RecipesViewComponent implements OnInit {
    @ViewChild(RecipeDialogComponent) dialog: RecipeDialogComponent;

    @Select(RecipeState.getAllRecipes) recipes$: Observable<Recipe[]>;
    @Select(RecipeState.loading) loading$: Observable<boolean>;

    constructor(private store: Store, private dialogService: DialogService) {}

    ngOnInit() {
        this.store.dispatch(new EnsureLoadAllRecipes());
    }

    onCreateRecipe() {
        this.dialog.open({} as Recipe, r => this.store.dispatch(new CreateRecipe(r)));
    }

    onEditRecipe(recipe: Recipe) {
        this.dialog.open(recipe, r => this.store.dispatch(new UpdateRecipe(r)));
    }

    onDeleteRecipe(recipe: Recipe) {
        this.dialogService
            .confirm(
                'Bestätigen',
                'Soll das Rezept wirklich gelöscht werden?',
                () => this.store.dispatch(new DeleteRecipe(recipe)),
                'Löschen',
                'btn-danger'
            )
            .subscribe();
    }
}
