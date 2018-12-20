import { IEnvironment } from './environment.interface';

export const environment: IEnvironment = {
  production: true,
  defaults: {
    project: {
      id: 1,
      name: 'default project name',
      tasks: [
        {
          id: 1,
          description: 'default 1 task description'
        },
        {
          id: 2,
          description: 'default 2 task description'
        }
      ]
    }
  }
};
