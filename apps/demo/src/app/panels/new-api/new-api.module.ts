import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewApiComponent } from './new-api.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [NewApiComponent],
  declarations: [NewApiComponent],
})
export class NewApiModule {}
