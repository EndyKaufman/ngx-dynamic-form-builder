import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { SharedModule } from '../../shared/shared.module';
import { NavbarLanguagesButtonsModule } from '../navbar-languages-buttons/navbar-languages-buttons.module';
import { NavbarComponent } from './navbar.component';

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
