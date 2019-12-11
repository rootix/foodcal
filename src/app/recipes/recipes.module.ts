import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';

import { SharedModule } from '../shared/shared.module';
import { RecipeDialogComponent } from './components/recipe-dialog/recipe-dialog.component';
import { RecipesListComponent } from './components/recipes-list/recipes-list.component';
import { RecipesRoutes } from './recipes.routing';
import { RecipeState } from './state/recipe.state';
import { RecipesViewComponent } from './views/recipes-view/recipes-view.component';

@NgModule({
    imports: [SharedModule, RecipesRoutes, ReactiveFormsModule, NgxsModule.forFeature([RecipeState])],
    declarations: [RecipesViewComponent, RecipesListComponent, RecipeDialogComponent]
})
export class RecipesModule {}
