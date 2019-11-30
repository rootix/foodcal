import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: 'recipes', loadChildren: () => import('./recipes/recipes.module').then(m => m.RecipesModule) }
];

export const AppRoutes = RouterModule.forRoot(routes);
