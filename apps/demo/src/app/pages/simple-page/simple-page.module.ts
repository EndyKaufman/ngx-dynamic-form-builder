import { NgModule } from '@angular/core';
import { SimplePageComponent } from './simple-page.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ModuleWithProviders } from '@angular/core';
import { DocsExampleModule } from '@ngx-docs/example';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { SimplePageRoutes } from './simple-page.routes';
import { CompanyPanelModule } from '../../panels/company-panel/company-panel.module';
import { SourceTabsModule } from '../../others/source-tabs/source-tabs.module';
import { MatIconModule } from '@angular/material';

@NgModule({
  imports: [
    SharedModule.forRoot(),
    FlexLayoutModule,
    DocsExampleModule.forRoot(),
    CompanyPanelModule.forRoot(),
    RouterModule.forChild(SimplePageRoutes),
    SourceTabsModule.forRoot(),
    MatIconModule
  ],
  entryComponents: [SimplePageComponent],
  exports: [SimplePageComponent],
  declarations: [SimplePageComponent]
})
export class SimplePageModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SimplePageModule,
      providers: []
    };
  }
}
