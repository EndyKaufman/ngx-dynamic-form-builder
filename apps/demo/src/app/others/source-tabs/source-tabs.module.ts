import { NgModule, ModuleWithProviders } from '@angular/core';
import { SourceTabsComponent } from './source-tabs.component';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedModule } from '../../shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
  imports: [
    SharedModule.forRoot(),
    MarkdownModule.forChild(),
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule
  ],
  entryComponents: [SourceTabsComponent],
  exports: [SourceTabsComponent],
  declarations: [SourceTabsComponent]
})
export class SourceTabsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SourceTabsModule,
      providers: []
    };
  }
}
