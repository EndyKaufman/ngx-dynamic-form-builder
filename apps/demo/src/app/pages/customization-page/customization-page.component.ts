import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'customization-page',
  templateUrl: './customization-page.component.html'
})
export class CustomizationPageComponent {

  customization =
    require('html-loader!markdown-loader!../../../../../../CUSTOMIZATION.md').
      replace('<h1 id="customization">customization</h1>', '');

  source = {
    html: require('!!raw-loader?lang=html!./customization-page.component.html.txt'),
    ts: require('!!raw-loader?lang=typescript!./customization-page.component.ts.txt')
  };
}
