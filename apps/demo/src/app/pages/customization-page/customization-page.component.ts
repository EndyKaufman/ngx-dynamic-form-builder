import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'customization-page',
  templateUrl: './customization-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomizationPageComponent {
  customization = require('!!raw-loader?lang=markdown!../../../../../../CUSTOMIZATION.md').replace(
    '# customization',
    ''
  );

  source = {
    html: require('!!raw-loader?lang=html!./customization-page.component.html.txt'),
    ts: require('!!raw-loader?lang=typescript!./customization-page.component.ts.txt')
  };
}
