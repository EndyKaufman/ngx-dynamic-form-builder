import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Router, Routes } from '@angular/router';
import { Language } from '../../shared/interfaces/language-interface';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  @Input()
  title: string | undefined;

  @Input()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set childrenRoutes(routes: any[]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this._childrenRoutes = routes.filter((item: any) => item.data);
  }
  get childrenRoutes() {
    return this._childrenRoutes
      ? this._childrenRoutes
          .filter(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (item: any) =>
              item.data &&
              item.data.visible !== false &&
              item.data.align !== 'left'
          )
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((item: any) => {
            const newItem = item.data;
            newItem.url = `/${newItem.name}`;
            newItem.redirectTo = item.redirectTo;
            return newItem;
          })
      : [];
  }
  get leftChildrenRoutes() {
    return this._childrenRoutes
      ? this._childrenRoutes
          .filter(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (item: any) =>
              item.data &&
              item.data.visible !== false &&
              item.data.align === 'left'
          )
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((item: any) => {
            const newItem = item.data;
            newItem.url = `/${newItem.name}`;
            newItem.redirectTo = item.redirectTo;
            return newItem;
          })
      : [];
  }

  @Input()
  languages: Language[] | undefined;

  @Input()
  current: Language | undefined;

  @Output()
  currentChange = new EventEmitter<Language>();

  private _childrenRoutes: Routes | undefined;

  constructor(public router: Router) {}
}
