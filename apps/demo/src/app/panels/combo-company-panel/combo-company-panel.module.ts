import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@ngneat/transloco';
import { SharedModule } from '../../shared/shared.module';
import { ComboCompanyPanelComponent } from './combo-company-panel.component';

@NgModule({
  imports: [
    SharedModule.forRoot(),
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    TranslocoModule,
  ],
  exports: [ComboCompanyPanelComponent],
  declarations: [ComboCompanyPanelComponent],
})
export class ComboCompanyPanelModule {
  static forRoot() {
    return {
      ngModule: ComboCompanyPanelModule,
      providers: [],
    };
  }
}
