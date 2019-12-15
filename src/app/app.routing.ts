import { RouterModule, Routes } from '@angular/router';

import { SCHEDULE_ROUTES } from './schedule/schedule.routing';

const routes: Routes = [
    { path: 'schedule', children: SCHEDULE_ROUTES },
    { path: 'recipes', loadChildren: () => import('./recipes/recipes.module').then(m => m.RecipesModule) },
    { path: '', redirectTo: 'schedule', pathMatch: 'full' }
];

export const AppRoutes = RouterModule.forRoot(routes);
