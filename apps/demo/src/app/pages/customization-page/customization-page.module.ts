import { NgModule, ModuleWithProviders } from '@angular/core';
import { CustomizationPageComponent } from './customization-page.component';
import { RouterModule } from '@angular/router';
import { CustomizationPageRoutes } from './customization-page.routes';
import { DocsExampleModule } from '@ngx-docs/example';
import { SharedModule } from '../../shared/shared.module';
import { SourceTabsModule } from '../../others/source-tabs/source-tabs.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
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
