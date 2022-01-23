import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { DocsExampleModule } from '../../others/docs-example/docs-example.module';
import { SourceTabsModule } from '../../others/source-tabs/source-tabs.module';
import { NewApiModule } from '../../panels/new-api/new-api.module';
import { SharedModule } from '../../shared/shared.module';
import { NewApiPageComponent } from './new-api-page.component';
import { NewApiPageRoutes } from './new-api-page.routes';

@NgModule({
  imports: [
    SharedModule.forRoot(),
    FlexLayoutModule,
    DocsExampleModule.forRoot(),
    NewApiModule,
    RouterModule.forChild(NewApiPageRoutes),
    SourceTabsModule.forRoot(),
    TranslocoModule,
  ],
  entryComponents: [NewApiPageComponent],
  exports: [NewApiPageComponent],
  declarations: [NewApiPageComponent],
})
export class NewApiPageModule {
  static forRoot() {
    return {
      ngModule: NewApiPageModule,
      providers: [],
    };
  }
}
