import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { updateValidatorMessagesStorage } from 'ngx-dynamic-form-builder';
import { AppRoutes } from './app.routes';
import { Language } from './shared/interfaces/language-interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'app';
  routes = AppRoutes;
  languages: Language[] = [
    { code: 'en', title: 'English' },
    { code: 'ru', title: 'Russian' },
  ];

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, public httpClient: HttpClient) {
    iconRegistry.addSvgIcon(
      'github-circle',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/github-circle.svg')
    );
    iconRegistry.addSvgIcon(
      'shape-outline',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/shape-outline.svg')
    );
    iconRegistry.addSvgIcon(
      'translate',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/g_translate-24px.svg')
    );
  }

  changeLanguage(currentLanguage: Language) {
    const foundedLang = this.languages.find((lang) => lang.code === currentLanguage.code);
    if (foundedLang) {
      if (!foundedLang.dictionaries) {
        this.httpClient
          .get<{ [key: string]: string }>(`./assets/i18n/class-validator-messages/${currentLanguage.code}.json`)
          .subscribe((dictionaries) => {
            if (foundedLang) {
              foundedLang.dictionaries = dictionaries;
              updateValidatorMessagesStorage(foundedLang.dictionaries);
            }
          });
      } else {
        updateValidatorMessagesStorage(foundedLang.dictionaries);
      }
    }
  }
}
