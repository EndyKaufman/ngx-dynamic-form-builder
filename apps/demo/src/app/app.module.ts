import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ErrorHandler } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NavbarModule } from './others/navbar/navbar.module';
import { MAT_DIALOG_DEFAULT_OPTIONS, ShowOnDirtyErrorStateMatcher, ErrorStateMatcher } from '@angular/material';
import { FormControl } from '@angular/forms';
import { FormGroupDirective } from '@angular/forms/src/directives/reactive_directives/form_group_directive';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { MyErrorStateMatcher } from './shared/utils/my-error-state-matcher';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { AppRoutes } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { MessageBoxModule } from './others/message-box/message-box.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    SharedModule.forRoot(),
    MessageBoxModule.forRoot(),
    HttpClientModule,
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'demo' }),
    NavbarModule.forRoot(),
    RouterModule.forRoot(AppRoutes, { preloadingStrategy: PreloadAllModules, initialNavigation: 'enabled' }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: MyErrorStateMatcher },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
