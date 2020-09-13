import { ModuleWithProviders, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { DocsExampleModule } from '../../others/docs-example/docs-example.module';
import { SourceTabsModule } from '../../others/source-tabs/source-tabs.module';
import { CompanyPanelModule } from '../../panels/company-panel/company-panel.module';
import { SharedModule } from '../../shared/shared.module';
import { I18nPageComponent } from './i18n-page.component';
import { I18nPageRoutes } from './i18n-page.routes';
import { MatIconModule } from '@angular/material/icon';
import { I18nCompanyPanelModule } from '../../panels/i18n-company-panel/i18n-company-panel.module';

@NgModule({
  imports: [
    SharedModule.forRoot(),
    FlexLayoutModule,
    DocsExampleModule.forRoot(),
    I18nCompanyPanelModule.forRoot(),
    RouterModule.forChild(I18nPageRoutes),
    SourceTabsModule.forRoot(),
    MatIconModule,
  ],
  entryComponents: [I18nPageComponent],
  exports: [I18nPageComponent],
  declarations: [I18nPageComponent],
})
export class I18nPageModule {
  static forRoot() {
    return {
      ngModule: I18nPageModule,
      providers: [],
    };
  }
}
