import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { AppRoutes } from './app.routes';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, AppRoutes, ClarityModule, BrowserAnimationsModule, CoreModule],
    bootstrap: [AppComponent]
})
export class AppModule {}
