import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Language } from '../../shared/interfaces/language-interface';

@Component({
  selector: 'navbar-languages-buttons',
  templateUrl: './navbar-languages-buttons.component.html',
})
export class NavbarLanguagesButtonsComponent {
  @Input()
  languages!: Language[];

  @Input()
  current!: Language;

  @Output()
  currentChange = new EventEmitter<Language>();

  setCurrent(lang: Language) {
    this.current = lang;
    this.currentChange.next(lang);
  }
}
