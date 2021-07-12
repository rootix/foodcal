import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { RecipeDialogComponent } from './components/recipe-dialog/recipe-dialog.component';
import { RecipesListComponent } from './components/recipes-list/recipes-list.component';
import { RECIPES_ROUTES } from './recipes.routing';
import { RecipesViewComponent } from './views/recipes-view/recipes-view.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';

@NgModule({
    imports: [SharedModule, RECIPES_ROUTES, NzTableModule, NzTagModule],
    declarations: [RecipesViewComponent, RecipesListComponent, RecipeDialogComponent],
})
export class RecipesModule {}
