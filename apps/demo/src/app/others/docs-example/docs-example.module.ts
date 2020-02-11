import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DocsExampleComponent } from './docs-example.component';
import { PACKAGE_CONFIG_TOKEN } from './docs-example.config';
import { PackageConfigInterface } from './package-config.interface';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
  declarations: [DocsExampleComponent],
  exports: [DocsExampleComponent],
  imports: [
    CommonModule,
    MarkdownModule.forChild(),
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatTooltipModule
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
