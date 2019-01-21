import { ViewInterface } from './docs-example.interface';

export abstract class DocsExampleClass {
  public view: ViewInterface;

  constructor(view: ViewInterface) {
    this.view = view;
  }

  switchActive(property: string): boolean {
    return (this.view[property].active = this.view[property].active === true ? false : true);
  }
}
