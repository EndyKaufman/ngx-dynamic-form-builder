import { ModuleWithProviders, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { DocsExampleModule } from '@ngx-docs/example';
import { SourceTabsModule } from '../../others/source-tabs/source-tabs.module';
import { ProjectPanelModule } from '../../panels/project-panel/project-panel.module';
import { SharedModule } from '../../shared/shared.module';
import { ProjectPageComponent } from './project-page.component';
import { ProjectPageRoutes } from './project-page.routes';

@NgModule({
  imports: [
    SharedModule.forRoot(),
    FlexLayoutModule,
    DocsExampleModule.forRoot(),
    ProjectPanelModule,
    RouterModule.forChild(ProjectPageRoutes),
    SourceTabsModule.forRoot(),
    MatIconModule
  ],
  entryComponents: [ProjectPageComponent],
  exports: [ProjectPageComponent],
  declarations: [ProjectPageComponent]
})
export class ProjectPageModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ProjectPageModule,
      providers: []
    };
  }
}
