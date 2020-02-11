import { ModuleWithProviders, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { DocsExampleModule } from '../../others/docs-example/docs-example.module';
import { SourceTabsModule } from '../../others/source-tabs/source-tabs.module';
import { ComboCompanyPanelModule } from '../../panels/combo-company-panel/combo-company-panel.module';
import { SharedModule } from '../../shared/shared.module';
import { ComboPageComponent } from './combo-page.component';
import { ComboPageRoutes } from './combo-page.routes';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    SharedModule.forRoot(),
    FlexLayoutModule,
    DocsExampleModule.forRoot(),
    ComboCompanyPanelModule.forRoot(),
    RouterModule.forChild(ComboPageRoutes),
    SourceTabsModule.forRoot(),
    MatIconModule
  ],
  entryComponents: [ComboPageComponent],
  exports: [ComboPageComponent],
  declarations: [ComboPageComponent]
})
export class ComboPageModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ComboPageModule,
      providers: []
    };
  }
}
