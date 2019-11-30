import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { RecipesListComponent } from './components/recipes-list/recipes-list.component';
import { RecipesRoutes } from './recipes.routing';
import { RecipesViewComponent } from './views/recipes-view/recipes-view.component';

@NgModule({
    imports: [SharedModule, RecipesRoutes],
    declarations: [RecipesViewComponent, RecipesListComponent]
})
export class RecipesModule {}
