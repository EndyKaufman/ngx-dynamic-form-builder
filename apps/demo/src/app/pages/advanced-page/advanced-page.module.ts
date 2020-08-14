import { NgModule } from '@angular/core';
import { AdvancedPageComponent } from './advanced-page.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ModuleWithProviders } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { AdvancedPageRoutes } from './advanced-page.routes';
import { UserPanelModule } from '../../panels/user-panel/user-panel.module';
import { SourceTabsModule } from '../../others/source-tabs/source-tabs.module';
import { DocsExampleModule } from '../../others/docs-example/docs-example.module';

@NgModule({
  imports: [
    SharedModule.forRoot(),
    FlexLayoutModule,
    DocsExampleModule.forRoot(),
    UserPanelModule.forRoot(),
    RouterModule.forChild(AdvancedPageRoutes),
    SourceTabsModule.forRoot(),
  ],
  entryComponents: [AdvancedPageComponent],
  exports: [AdvancedPageComponent],
  declarations: [AdvancedPageComponent],
})
export class AdvancedPageModule {
  static forRoot() {
    return {
      ngModule: AdvancedPageModule,
      providers: [],
    };
  }
}
