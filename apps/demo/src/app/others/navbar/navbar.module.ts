import { NgModule, ModuleWithProviders } from '@angular/core';
import { NavbarComponent } from './navbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatMenuModule } from '@angular/material/menu';
import { NavbarLanguagesButtonsModule } from '../navbar-languages-buttons/navbar-languages-buttons.module';
import { TranslocoModule } from '@ngneat/transloco';

@NgModule({
  imports: [
    SharedModule.forRoot(),
    MatToolbarModule,
    MatButtonModule,
    RouterModule,
    MatIconModule,
    FlexLayoutModule,
    MatMenuModule,
    NavbarLanguagesButtonsModule,
    TranslocoModule,
  ],
  entryComponents: [NavbarComponent],
  exports: [NavbarComponent],
  declarations: [NavbarComponent],
})
export class NavbarModule {
  static forRoot() {
    return {
      ngModule: NavbarModule,
      providers: [],
    };
  }
}
