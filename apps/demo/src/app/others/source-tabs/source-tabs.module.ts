import { NgModule, ModuleWithProviders } from '@angular/core';
import { SourceTabsComponent } from './source-tabs.component';
import { PrismModule } from '@ngx-prism/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material';
import { SharedModule } from '../../shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    SharedModule.forRoot(),
    PrismModule,
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
