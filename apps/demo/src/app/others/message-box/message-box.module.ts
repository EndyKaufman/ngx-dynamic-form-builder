import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '../../shared/shared.module';
import { MessageBoxComponent } from './message-box.component';
import { MessageBoxService } from './message-box.service';

@NgModule({
  imports: [
    SharedModule.forRoot(),
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    FlexLayoutModule,
  ],
  providers: [MessageBoxService],
  exports: [MessageBoxComponent],
  declarations: [MessageBoxComponent],
})
export class MessageBoxModule {
  static forRoot() {
    return {
      ngModule: MessageBoxModule,
      providers: [MessageBoxService],
    };
  }
}
