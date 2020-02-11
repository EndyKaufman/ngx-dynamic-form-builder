import { ModuleWithProviders, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { DocsExampleModule } from '../../others/docs-example/docs-example.module';
import { SourceTabsModule } from '../../others/source-tabs/source-tabs.module';
import { CompanyPanelModule } from '../../panels/company-panel/company-panel.module';
import { SharedModule } from '../../shared/shared.module';
import { SimplePageComponent } from './simple-page.component';
import { SimplePageRoutes } from './simple-page.routes';
import { MatIconModule } from '@angular/material/icon';

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
