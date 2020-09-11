import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { DocsExampleModule } from '../../others/docs-example/docs-example.module';
import { SourceTabsModule } from '../../others/source-tabs/source-tabs.module';
import { ExpLoginPanelModule } from '../../panels/exp-login-panel/exp-login-panel.module';
import { ExpRegistrationPanelModule } from '../../panels/exp-registration-panel/exp-registration-panel.module';
import { ExpUserPanelModule } from '../../panels/exp-user-panel/exp-user-panel.module';
import { SharedModule } from '../../shared/shared.module';
import { ExperimentalPageComponent } from './experimental-page.component';
import { ExperimentalPageRoutes } from './experimental-page.routes';

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
    TranslocoModule,
  ],
  entryComponents: [ExperimentalPageComponent],
  exports: [ExperimentalPageComponent],
  declarations: [ExperimentalPageComponent],
})
export class ExperimentalPageModule {
  static forRoot() {
    return {
      ngModule: ExperimentalPageModule,
      providers: [],
    };
  }
}
