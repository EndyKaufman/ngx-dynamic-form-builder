import { ModuleWithProviders, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { DocsExampleModule } from '../../others/docs-example/docs-example.module';
import { SourceTabsModule } from '../../others/source-tabs/source-tabs.module';
import { SharedModule } from '../../shared/shared.module';
import { CustomizationPageComponent } from './customization-page.component';
import { CustomizationPageRoutes } from './customization-page.routes';

@NgModule({
  imports: [
    MarkdownModule.forChild(),
    SharedModule.forRoot(),
    RouterModule.forChild(CustomizationPageRoutes),
    DocsExampleModule.forRoot(),
    SourceTabsModule.forRoot(),
    FlexLayoutModule
  ],
  declarations: [CustomizationPageComponent]
})
export class CustomizationPageModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CustomizationPageModule,
      providers: []
    };
  }
}
