import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { SharedModule } from '../../shared/shared.module';
import { ProjectPanelCompleteComponent } from './project-panel-complete.component';
import { ProjectPanelStep1Component } from './project-panel-step-1.component';
import { ProjectPanelStep2Component } from './project-panel-step-2.component';
import { ProjectPanelService } from './project-panel.service';
@NgModule({
  imports: [
    SharedModule.forRoot(),
    MatButtonModule,
    MatInputModule,
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    RouterModule,
    TranslocoModule,
  ],
  exports: [
    ProjectPanelStep1Component,
    ProjectPanelStep2Component,
    ProjectPanelCompleteComponent,
  ],
  declarations: [
    ProjectPanelStep1Component,
    ProjectPanelStep2Component,
    ProjectPanelCompleteComponent,
  ],
  providers: [ProjectPanelService],
})
export class ProjectPanelModule {}
