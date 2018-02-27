import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { ModuleWithProviders } from '@angular/core';
import { CompanyPanelComponent } from '../../panels/company-panel/company-panel.component';
import { MatInputModule, MatCheckboxModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

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
  entryComponents: [CompanyPanelComponent],
  exports: [CompanyPanelComponent],
  declarations: [CompanyPanelComponent]
})
export class CompanyPanelModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CompanyPanelModule,
      providers: []
    };
  }
}
