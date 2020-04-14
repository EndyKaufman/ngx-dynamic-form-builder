import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { ModuleWithProviders } from '@angular/core';
import { ExpRegistrationPanelComponent } from '../exp-registration-panel/exp-registration-panel.component';
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
    FlexLayoutModule,
  ],
  entryComponents: [ExpRegistrationPanelComponent],
  exports: [ExpRegistrationPanelComponent],
  declarations: [ExpRegistrationPanelComponent],
})
export class ExpRegistrationPanelModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ExpRegistrationPanelModule,
      providers: [],
    };
  }
}
