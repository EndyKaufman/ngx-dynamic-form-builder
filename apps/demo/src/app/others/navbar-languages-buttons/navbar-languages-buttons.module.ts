import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslocoModule } from '@ngneat/transloco';
import { NavbarLanguagesButtonsComponent } from './navbar-languages-buttons.component';

@NgModule({
  imports: [
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    TranslocoModule,
  ],
  declarations: [NavbarLanguagesButtonsComponent],
  exports: [NavbarLanguagesButtonsComponent],
})
export class NavbarLanguagesButtonsModule {}
