import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'advanced-page',
  templateUrl: './advanced-page.component.html',
  styleUrls: ['./advanced-page.component.scss']
})
export class AdvancedPageComponent {

  source = {
    html: require('!!raw-loader?lang=html!./../../panels/user-panel/user-panel.component.html'),
    ts: require('!!raw-loader?lang=typescript!./../../panels/user-panel/user-panel.component.ts')
  };

  otherFiles: { name: string, language: string, content: string }[] = [
    {
      name: 'user.ts',
      language: 'javascript',
      content: require('!!raw-loader?lang=typescript!../../shared/models/user.ts')
    },
    {
      name: 'department.ts',
      language: 'javascript',
      content: require('!!raw-loader?lang=typescript!../../shared/models/department.ts')
    },
    {
      name: 'company.ts',
      language: 'javascript',
      content: require('!!raw-loader?lang=typescript!../../shared/models/company.ts')
    },
    {
      name: 'custom-transforms.ts',
      language: 'javascript',
      content: require('!!raw-loader?lang=typescript!../../shared/utils/custom-transforms.ts')
    },
    {
      name: 'custom-validators.ts',
      language: 'javascript',
      content: require('!!raw-loader?lang=typescript!../../shared/utils/custom-validators.ts')
    }
  ];
}
