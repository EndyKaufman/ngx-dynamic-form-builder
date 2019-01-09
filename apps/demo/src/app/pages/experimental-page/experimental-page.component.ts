import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'experimental-page',
  templateUrl: './experimental-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExperimentalPageComponent {
  source = {
    html: require('!!raw-loader?lang=html!./../../panels/exp-user-panel/exp-user-panel.component.html'),
    ts: require('!!raw-loader?lang=typescript!./../../panels/exp-user-panel/exp-user-panel.component.ts'),
    launch: {
      location: 'https://stackblitz.com/edit/ngx-dynamic-form-builder-experimental',
      tooltip: `Edit in http://stackblitz.com`
    }
  };

  loginSource = {
    html: require('!!raw-loader?lang=html!./../../panels/exp-login-panel/exp-login-panel.component.html'),
    ts: require('!!raw-loader?lang=typescript!./../../panels/exp-login-panel/exp-login-panel.component.ts'),
    launch: {
      location: 'https://stackblitz.com/edit/ngx-dynamic-form-builder-experimental-login',
      tooltip: `Edit in http://stackblitz.com`
    }
  };

  otherFiles: { name: string; language: string; content: string }[] = [
    {
      name: 'exp-user.ts',
      language: 'javascript',
      content: require('!!raw-loader?lang=typescript!../../shared/models/exp-user.ts')
    },
    {
      name: 'exp-department.ts',
      language: 'javascript',
      content: require('!!raw-loader?lang=typescript!../../shared/models/exp-department.ts')
    },
    {
      name: 'exp-company.ts',
      language: 'javascript',
      content: require('!!raw-loader?lang=typescript!../../shared/models/exp-company.ts')
    },
    {
      name: 'custom-validators.ts',
      language: 'javascript',
      content: require('!!raw-loader?lang=typescript!../../shared/utils/custom-validators.ts')
    }
  ];
}
