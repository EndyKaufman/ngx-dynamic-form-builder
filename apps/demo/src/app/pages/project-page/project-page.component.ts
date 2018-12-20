import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectPageComponent {
  source = {
    html: require('!!raw-loader?lang=html!./../../panels/project-panel/project-panel-step-1.component.html'),
    ts: require('!!raw-loader?lang=typescript!./../../panels/project-panel/project-panel-step-1.component.ts')
  };

  otherFiles: { name: string; language: string; content: string }[] = [
    {
      name: 'project.ts',
      language: 'javascript',
      content: require('!!raw-loader?lang=typescript!../../shared/models/project.ts')
    },
    {
      name: 'task.ts',
      language: 'javascript',
      content: require('!!raw-loader?lang=typescript!../../shared/models/task.ts')
    },
    {
      name: 'task.ts',
      language: 'javascript',
      content: require('!!raw-loader?lang=typescript!../../shared/models/task.ts')
    }
  ];
}
