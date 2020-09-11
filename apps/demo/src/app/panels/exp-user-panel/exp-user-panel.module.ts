import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@ngneat/transloco';
import { ExpUserPanelComponent } from '../../panels/exp-user-panel/exp-user-panel.component';
import { SharedModule } from '../../shared/shared.module';

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
  entryComponents: [ExpUserPanelComponent],
  exports: [ExpUserPanelComponent],
  declarations: [ExpUserPanelComponent],
})
export class ExpUserPanelModule {
  static forRoot() {
    return {
      ngModule: ExpUserPanelModule,
      providers: [],
    };
  }
}
