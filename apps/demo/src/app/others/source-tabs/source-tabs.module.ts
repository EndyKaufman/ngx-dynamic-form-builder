import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MarkdownModule } from 'ngx-markdown';
import { SharedModule } from '../../shared/shared.module';
import { SourceTabsComponent } from './source-tabs.component';

@NgModule({
  imports: [
    SharedModule.forRoot(),
    MarkdownModule.forChild(),
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
  ],
  entryComponents: [SourceTabsComponent],
  exports: [SourceTabsComponent],
  declarations: [SourceTabsComponent],
})
export class SourceTabsModule {
  static forRoot() {
    return {
      ngModule: SourceTabsModule,
      providers: [],
    };
  }
}
