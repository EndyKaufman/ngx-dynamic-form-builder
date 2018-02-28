import { NgModule, ModuleWithProviders } from '@angular/core';
import { HomePageComponent } from './home-page.component';
import { RouterModule } from '@angular/router';
import { HomePageRoutes } from './home-page.routes';
import { DocsExampleModule } from '@ngx-docs/example';
import { SharedModule } from '../../shared/shared.module';
import { SourceTabsModule } from '../../others/source-tabs/source-tabs.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    SharedModule.forRoot(),
    RouterModule.forChild(HomePageRoutes),
    DocsExampleModule.forRoot(),
    SourceTabsModule.forRoot(),
    FlexLayoutModule
  ],
  declarations: [HomePageComponent]
})
export class HomePageModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: HomePageModule,
      providers: []
    };
  }
}
