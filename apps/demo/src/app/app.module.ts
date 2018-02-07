import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ErrorHandler } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NavbarModule } from './controls/navbar/navbar.module';
import { HomePageModule } from './pages/home-page/home-page.module';
import { MAT_DIALOG_DEFAULT_OPTIONS, ShowOnDirtyErrorStateMatcher, ErrorStateMatcher } from '@angular/material';
import { FormControl } from '@angular/forms';
import { FormGroupDirective } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { MyErrorStateMatcher } from './shared/utils/my-error-state-matcher';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NavbarModule,
    HomePageModule
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: MyErrorStateMatcher },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
