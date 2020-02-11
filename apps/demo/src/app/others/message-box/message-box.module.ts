import { NgModule, ModuleWithProviders } from '@angular/core';
import { MessageBoxComponent } from './message-box.component';
import { SharedModule } from '../../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MessageBoxService } from './message-box.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  imports: [SharedModule.forRoot(), MatDialogModule, MatButtonModule, MatInputModule, FlexLayoutModule],
  providers: [MessageBoxService],
  entryComponents: [MessageBoxComponent],
  exports: [MessageBoxComponent],
  declarations: [MessageBoxComponent]
})
export class MessageBoxModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MessageBoxModule,
      providers: [MessageBoxService]
    };
  }
}
