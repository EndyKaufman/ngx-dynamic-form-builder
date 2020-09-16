import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@ngneat/transloco';
import { SharedModule } from '../../shared/shared.module';
import { ExpUserPanelComponent } from './exp-user-panel.component';
import { MatDatepickerModule } from '@angular/material/datepicker';

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
    MatDatepickerModule,
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
