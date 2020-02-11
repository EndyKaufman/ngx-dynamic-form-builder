import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'combo-page',
  templateUrl: './combo-page.component.html',
  styleUrls: ['./combo-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComboPageComponent {
  source = {
    html: require('!!raw-loader!./../../panels/combo-company-panel/combo-company-panel.component.html').default,
    ts: require('!!raw-loader!./../../panels/combo-company-panel/combo-company-panel.component.ts').default
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
