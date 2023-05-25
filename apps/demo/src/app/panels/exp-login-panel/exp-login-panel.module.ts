import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@ngneat/transloco';
import { SharedModule } from '../../shared/shared.module';
import { ExpLoginPanelComponent } from './exp-login-panel.component';

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
  exports: [ExpLoginPanelComponent],
  declarations: [ExpLoginPanelComponent],
})
export class ExpLoginPanelModule {
  static forRoot() {
    return {
      ngModule: ExpLoginPanelModule,
      providers: [],
    };
  }
}
