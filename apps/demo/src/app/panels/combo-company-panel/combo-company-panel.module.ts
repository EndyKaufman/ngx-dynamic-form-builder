import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { ModuleWithProviders } from '@angular/core';
import { ComboCompanyPanelComponent } from '../../panels/combo-company-panel/combo-company-panel.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  imports: [
    SharedModule.forRoot(),
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ],
  entryComponents: [ComboCompanyPanelComponent],
  exports: [ComboCompanyPanelComponent],
  declarations: [ComboCompanyPanelComponent]
})
export class ComboCompanyPanelModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ComboCompanyPanelModule,
      providers: []
    };
  }
}
