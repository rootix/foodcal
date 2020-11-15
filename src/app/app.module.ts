import '@angular/common/locales/global/de-CH';

import { HttpClientModule } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApolloLink, InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { ClarityModule } from '@clr/angular';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { environment } from 'src/environments/environment';

import { AppComponent } from './app.component';
import { APP_ROUTES } from './app.routing';
import { CoreModule } from './core/core.module';
import { ScheduleModule } from './schedule/schedule.module';
import { AuthState } from './shared/state/auth';
import { RecipeState } from './shared/state/recipe/recipe.state';

const uri = 'https://graphql.fauna.com/graphql';

const provideApolloFn = (httpLink: HttpLink) => {
    const defaultOptions = {
        watchQuery: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'ignore',
        },
        query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
        },
    };

    const basic = setContext((operation, context) => ({
        headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Accept: 'charset=utf-8',
        },
    }));

    const auth = setContext((operation, context) => ({
        headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('auth.token'))}`,
        },
    }));

    const link = ApolloLink.from([basic, auth, httpLink.create({ uri })]);
    const cache = new InMemoryCache();

    return {
        link,
        cache,
        defaultOptions,
    };
};

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        HttpClientModule,
        APP_ROUTES,
        ClarityModule,
        BrowserAnimationsModule,
        CoreModule,
        NgxsModule.forRoot([AuthState, RecipeState], {
            developmentMode: !environment.production,
            selectorOptions: { injectContainerState: false, suppressErrors: false },
        }),
        NgxsStoragePluginModule.forRoot({
            key: 'auth.token',
        }),
        ScheduleModule,
        NgxsReduxDevtoolsPluginModule.forRoot(),
    ],
    bootstrap: [AppComponent],
    providers: [
        { provide: LOCALE_ID, useValue: 'de-CH' },
        {
            provide: APOLLO_OPTIONS,
            useFactory: provideApolloFn,
            deps: [HttpLink],
        },
    ],
})
export class AppModule {}
