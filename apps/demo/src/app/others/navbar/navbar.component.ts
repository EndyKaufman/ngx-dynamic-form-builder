import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { Language } from '../../shared/interfaces/language-interface';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit {
  @Input()
  title: string;

  @Input()
  set childrenRoutes(routes: any[]) {
    this._childrenRoutes = routes.filter((item: any) => item.data);
  }
  get childrenRoutes() {
    return this._childrenRoutes
      ? this._childrenRoutes
          .filter((item: any) => item.data && item.data.visible !== false && item.data.align !== 'left')
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
          .filter((item: any) => item.data && item.data.visible !== false && item.data.align === 'left')
          .map((item: any) => {
            const newItem = item.data;
            newItem.url = `/${newItem.name}`;
            newItem.redirectTo = item.redirectTo;
            return newItem;
          })
      : [];
  }

  @Input()
  languages: Language[];

  @Input()
  current: Language;

  @Output()
  currentChange = new EventEmitter<Language>();

  private _childrenRoutes: Routes;

  constructor(public router: Router) {}

  ngOnInit() {}
}
