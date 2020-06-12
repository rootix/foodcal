import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localeDeCh from '@angular/common/locales/de-CH';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClarityModule } from '@clr/angular';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { environment } from 'src/environments/environment';

import { AppComponent } from './app.component';
import { AppRoutes } from './app.routing';
import { CoreModule } from './core/core.module';
import { ScheduleModule } from './schedule/schedule.module';
import { AuthState } from './shared/state/auth';
import { RecipeState } from './shared/state/recipe/recipe.state';

registerLocaleData(localeDeCh, 'de-CH');

const uri = 'https://graphql.fauna.com/graphql';

export function provideApollo(httpLink: HttpLink) {
    const defaultOptions = {
        watchQuery: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'ignore'
        },
        query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all'
        }
    };

    const basic = setContext((operation, context) => ({
        headers: {
            Accept: 'charset=utf-8'
        }
    }));

    const auth = setContext((operation, context) => ({
        headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('auth.token'))}`
        }
    }));

    const link = ApolloLink.from([basic, auth, httpLink.create({ uri })]);
    const cache = new InMemoryCache();

    return {
        link,
        cache,
        defaultOptions
    };
}

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutes,
        ClarityModule,
        BrowserAnimationsModule,
        CoreModule,
        HttpLinkModule,
        NgxsModule.forRoot([AuthState, RecipeState], {
            developmentMode: !environment.production,
            selectorOptions: { injectContainerState: false, suppressErrors: false }
        }),
        NgxsStoragePluginModule.forRoot({
            key: 'auth.token'
        }),
        ScheduleModule,
        NgxsReduxDevtoolsPluginModule.forRoot()
    ],
    bootstrap: [AppComponent],
    providers: [
        { provide: LOCALE_ID, useValue: 'de-CH' },
        {
            provide: APOLLO_OPTIONS,
            useFactory: provideApollo,
            deps: [HttpLink]
        }
    ]
})
export class AppModule {}
