import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'experimental-page',
  templateUrl: './experimental-page.component.html'
})
export class ExperimentalPageComponent {

  source = {
    html: require('!!raw-loader?lang=html!./../../panels/exp-user-panel/exp-user-panel.component.html'),
    ts: require('!!raw-loader?lang=typescript!./../../panels/exp-user-panel/exp-user-panel.component.ts')
  };

  otherFiles: { name: string, language: string, content: string }[] = [
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
