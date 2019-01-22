import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Optional } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatIconModule, MatTabsModule, MatTooltipModule } from '@angular/material';
import { PrismModule } from '@ngx-prism/core';
import { DocsExampleComponent } from './docs-example.component';
import { PACKAGE_CONFIG_TOKEN } from './docs-example.config';
import { PackageConfigInterface } from './package-config.interface';

@NgModule({
  declarations: [DocsExampleComponent],
  exports: [DocsExampleComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatTooltipModule,
    PrismModule
  ]
})
export class DocsExampleModule {
  static forRoot(config?: PackageConfigInterface | undefined): ModuleWithProviders {
    return {
      ngModule: DocsExampleModule,
      providers: [{ provide: PACKAGE_CONFIG_TOKEN, useValue: config }]
    };
  }
}
