import { registerLocaleData } from '@angular/common';
import localeDeCh from '@angular/common/locales/de-CH';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClarityModule } from '@clr/angular';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsModule } from '@ngxs/store';
import { environment } from 'src/environments/environment';

import { AppComponent } from './app.component';
import { AppRoutes } from './app.routing';
import { CoreModule } from './core/core.module';
import { ScheduleModule } from './schedule/schedule.module';

registerLocaleData(localeDeCh, 'de-CH');

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutes,
        ClarityModule,
        BrowserAnimationsModule,
        CoreModule,
        NgxsModule.forRoot([], { developmentMode: !environment.production }),
        ScheduleModule,
        NgxsReduxDevtoolsPluginModule.forRoot()
    ],
    bootstrap: [AppComponent],
    providers: [{ provide: LOCALE_ID, useValue: 'de-CH' }]
})
export class AppModule {}
