import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'source-tabs',
  templateUrl: './source-tabs.component.html'
})
export class SourceTabsComponent {

  @Input()
  title: string;

  @Input()
  files: { name: string, language: string, content: string }[];

}
