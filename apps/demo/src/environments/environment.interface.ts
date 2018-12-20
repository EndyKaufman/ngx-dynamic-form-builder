import { Project } from '../app/shared/models/project';
import { Task } from '../app/shared/models/task';

export interface IEnvironment {
    production: boolean;
    defaults?: {
        project?: Project;
        task?: Task;
    };
}
