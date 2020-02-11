import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
  readme = require('!!raw-loader!../../../../../../README.md').default.replace('# ngx-dynamic-form-builder', '');

  source = {
    html: require('!!raw-loader!./home-page.component.html.txt').default,
    ts: require('!!raw-loader!./home-page.component.ts.txt').default
  };

  otherFiles: { name: string; language: string; content: string }[] = [
    {
      name: 'safe-html.pipe.ts',
      language: 'javascript',
      content: require('!!raw-loader!../../shared/pipes/safe-html.pipe.ts').default
    },
    {
      name: 'README.md',
      language: 'markdown',
      content: require('!!raw-loader!../../../../../../README.md').default
    }
  ];
}
