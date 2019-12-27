import { RouterModule, Routes } from '@angular/router';

import { LoginViewComponent } from './core/views/login-view/login-view.component';
import { SCHEDULE_ROUTES } from './schedule/schedule.routing';
import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [
    { path: 'login', component: LoginViewComponent },
    { path: 'schedule', children: SCHEDULE_ROUTES, canActivate: [AuthGuard] },
    {
        path: 'recipes',
        loadChildren: () => import('./recipes/recipes.module').then(m => m.RecipesModule),
        canActivate: [AuthGuard]
    },
    { path: '', redirectTo: 'schedule', pathMatch: 'full' }
];

export const AppRoutes = RouterModule.forRoot(routes);
