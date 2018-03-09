import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { ModuleWithProviders } from '@angular/core';
import { ExpLoginPanelComponent } from '../../panels/exp-login-panel/exp-login-panel.component';
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
  entryComponents: [ExpLoginPanelComponent],
  exports: [ExpLoginPanelComponent],
  declarations: [ExpLoginPanelComponent]
})
export class ExpLoginPanelModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ExpLoginPanelModule,
      providers: []
    };
  }
}
