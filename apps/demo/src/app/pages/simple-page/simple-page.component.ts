import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'simple-page',
  templateUrl: './simple-page.component.html',
  styleUrls: ['./simple-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimplePageComponent {
  source = {
    html: require('!!raw-loader!./../../panels/company-panel/company-panel.component.html').default,
    ts: require('!!raw-loader!./../../panels/company-panel/company-panel.component.ts').default
  };

  otherFiles: { name: string; language: string; content: string }[] = [
    {
      name: 'company.ts',
      language: 'javascript',
      content: require('!!raw-loader!../../shared/models/company.ts').default
    },
    {
      name: 'custom-validators.ts',
      language: 'javascript',
      content: require('!!raw-loader!../../shared/utils/custom-validators.ts').default
    }
  ];
}
