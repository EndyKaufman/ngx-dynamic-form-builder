import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { ModuleWithProviders } from '@angular/core';
import { ExpUserPanelComponent } from '../../panels/exp-user-panel/exp-user-panel.component';
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
  entryComponents: [ExpUserPanelComponent],
  exports: [ExpUserPanelComponent],
  declarations: [ExpUserPanelComponent]
})
export class ExpUserPanelModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ExpUserPanelModule,
      providers: []
    };
  }
}
