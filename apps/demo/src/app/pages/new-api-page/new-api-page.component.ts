import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'new-api-page',
  templateUrl: './new-api-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewApiPageComponent {
  source = {
    html: require('!!raw-loader!./../../panels/new-api/new-api.component.html')
      .default,
    ts: require('!!raw-loader!./../../panels/new-api/new-api.component.ts')
      .default,
    launch: {
      location: 'https://stackblitz.com/edit/ngx-dynamic-form-builder-new-api',
      tooltip: `Edit in http://stackblitz.com`,
    },
  };
}
