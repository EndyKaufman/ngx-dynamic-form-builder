import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NewApiModule } from './new-api/new-api.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, NewApiModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
