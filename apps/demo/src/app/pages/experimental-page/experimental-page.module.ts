import { NgModule } from '@angular/core';
import { ExperimentalPageComponent } from './experimental-page.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ModuleWithProviders } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ExperimentalPageRoutes } from './experimental-page.routes';
import { SourceTabsModule } from '../../others/source-tabs/source-tabs.module';
import { ExpUserPanelModule } from '../../panels/exp-user-panel/exp-user-panel.module';
import { ExpLoginPanelModule } from '../../panels/exp-login-panel/exp-login-panel.module';
import { DocsExampleModule } from '../../others/docs-example/docs-example.module';
import { ExpRegistrationPanelModule } from '../../panels/exp-registration-panel/exp-registration-panel.module';

@NgModule({
  imports: [
    SharedModule.forRoot(),
    FlexLayoutModule,
    DocsExampleModule.forRoot(),
    ExpUserPanelModule.forRoot(),
    ExpLoginPanelModule.forRoot(),
    ExpRegistrationPanelModule.forRoot(),
    RouterModule.forChild(ExperimentalPageRoutes),
    SourceTabsModule.forRoot(),
  ],
  entryComponents: [ExperimentalPageComponent],
  exports: [ExperimentalPageComponent],
  declarations: [ExperimentalPageComponent],
})
export class ExperimentalPageModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ExperimentalPageModule,
      providers: [],
    };
  }
}
