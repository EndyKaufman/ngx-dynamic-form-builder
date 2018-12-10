import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'source-tabs',
  templateUrl: './source-tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SourceTabsComponent {
  @Input()
  title: string;

  @Input()
  files: { name: string; language: string; content: string }[];
}
