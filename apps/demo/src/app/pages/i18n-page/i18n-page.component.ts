import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'i18n-page',
  templateUrl: './i18n-page.component.html',
  styleUrls: ['./i18n-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class I18nPageComponent {
  source = {
    html: require('!!raw-loader!./../../panels/i18n-company-panel/i18n-company-panel.component.html').default,
    ts: require('!!raw-loader!./../../panels/i18n-company-panel/i18n-company-panel.component.ts').default,
  };

  otherFiles: { name: string; language: string; content: string }[] = [
    {
      name: 'company.ts',
      language: 'javascript',
      content: require('!!raw-loader!../../shared/models/company.ts').default,
    },
    {
      name: 'custom-validators.ts',
      language: 'javascript',
      content: require('!!raw-loader!../../shared/utils/custom-validators.ts').default,
    },
  ];
}
