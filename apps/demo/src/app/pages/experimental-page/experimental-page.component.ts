import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'experimental-page',
  templateUrl: './experimental-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExperimentalPageComponent {
  source = {
    html: require('!!raw-loader!./../../panels/exp-user-panel/exp-user-panel.component.html').default,
    ts: require('!!raw-loader!./../../panels/exp-user-panel/exp-user-panel.component.ts').default,
    launch: {
      location: 'https://stackblitz.com/edit/ngx-dynamic-form-builder-experimental',
      tooltip: `Edit in http://stackblitz.com`
    }
  };

  loginSource = {
    html: require('!!raw-loader!./../../panels/exp-login-panel/exp-login-panel.component.html').default,
    ts: require('!!raw-loader!./../../panels/exp-login-panel/exp-login-panel.component.ts').default,
    launch: {
      location: 'https://stackblitz.com/edit/ngx-dynamic-form-builder-experimental-login',
      tooltip: `Edit in http://stackblitz.com`
    }
  };

  otherFiles: { name: string; language: string; content: string }[] = [
    {
      name: 'exp-user.ts',
      language: 'javascript',
      content: require('!!raw-loader!../../shared/models/exp-user.ts').default
    },
    {
      name: 'exp-department.ts',
      language: 'javascript',
      content: require('!!raw-loader!../../shared/models/exp-department.ts').default
    },
    {
      name: 'exp-company.ts',
      language: 'javascript',
      content: require('!!raw-loader!../../shared/models/exp-company.ts').default
    },
    {
      name: 'custom-validators.ts',
      language: 'javascript',
      content: require('!!raw-loader!../../shared/utils/custom-validators.ts').default
    }
  ];
}
