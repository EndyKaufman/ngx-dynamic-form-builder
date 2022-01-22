import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'source-tabs',
  templateUrl: './source-tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SourceTabsComponent {
  @Input()
  title: string | undefined;

  @Input()
  files: { name: string; language: string; content: string }[] | undefined;
}
