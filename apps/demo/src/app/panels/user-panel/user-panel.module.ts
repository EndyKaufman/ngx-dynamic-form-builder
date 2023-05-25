import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '../../shared/shared.module';
import { UserPanelComponent } from './user-panel.component';
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
    MatDatepickerModule,
  ],
  exports: [UserPanelComponent],
  declarations: [UserPanelComponent],
})
export class UserPanelModule {
  static forRoot() {
    return {
      ngModule: UserPanelModule,
      providers: [],
    };
  }
}
