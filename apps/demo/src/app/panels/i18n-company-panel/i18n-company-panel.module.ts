import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '../../shared/shared.module';
import { I18nCompanyPanelComponent } from './i18n-company-panel.component';

@NgModule({
  imports: [
    SharedModule.forRoot(),
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatSelectModule,
  ],
  entryComponents: [I18nCompanyPanelComponent],
  exports: [I18nCompanyPanelComponent],
  declarations: [I18nCompanyPanelComponent],
})
export class I18nCompanyPanelModule {
  static forRoot() {
    return {
      ngModule: I18nCompanyPanelModule,
      providers: [],
    };
  }
}
