import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { DocsExampleModule } from '../../others/docs-example/docs-example.module';
import { SourceTabsModule } from '../../others/source-tabs/source-tabs.module';
import { UserPanelModule } from '../../panels/user-panel/user-panel.module';
import { SharedModule } from '../../shared/shared.module';
import { AdvancedPageComponent } from './advanced-page.component';
import { AdvancedPageRoutes } from './advanced-page.routes';

@NgModule({
  imports: [
    SharedModule.forRoot(),
    FlexLayoutModule,
    DocsExampleModule.forRoot(),
    UserPanelModule.forRoot(),
    RouterModule.forChild(AdvancedPageRoutes),
    SourceTabsModule.forRoot(),
  ],
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
