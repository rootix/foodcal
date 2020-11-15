import { RouterModule, Routes } from '@angular/router';

import { RecipesViewComponent } from './views/recipes-view/recipes-view.component';

const routes: Routes = [{ path: '', component: RecipesViewComponent }];

export const RECIPES_ROUTES = RouterModule.forChild(routes);
