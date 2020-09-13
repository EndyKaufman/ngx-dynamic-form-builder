import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslocoService } from '@ngneat/transloco';
import { marker } from '@ngneat/transloco-keys-manager/marker';
import { updateValidatorMessagesStorage, updateValidatorTitlesStorage } from 'ngx-dynamic-form-builder';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
    {
      code: 'en',
      title: marker('English'),
    },
    {
      code: 'ru',
      title: marker('Russian'),
    },
  ];

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    public httpClient: HttpClient,
    private readonly translocoService: TranslocoService
  ) {
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
    // translocoService.setFallbackLangForMissingTranslation({ fallbackLang: 'en' });
  }

  changeLanguage(newLanguage: Language) {
    const foundedLang = this.languages.find((lang) => lang.code === newLanguage.code);
    if (foundedLang) {
      if (!foundedLang.validatorMessages) {
        forkJoin({
          messages: this.httpClient
            .get<{ [key: string]: string }>(
              `${document.baseURI}assets/i18n/class-validator-messages/${newLanguage.code}.json`
            )
            .pipe(catchError(() => of({}))),
          titles: this.httpClient
            .get<{ [key: string]: string }>(`${document.baseURI}assets/i18n/${newLanguage.code}.json`)
            .pipe(catchError(() => of({}))),
        }).subscribe(({ messages, titles }) => {
          if (foundedLang) {
            foundedLang.validatorMessages = messages;
            foundedLang.validatorTitles = titles;
            updateValidatorMessagesStorage({
              ...foundedLang.validatorMessages,
              ...foundedLang.staticValidatorMessages,
              ...foundedLang.validatorTitles,
            });
            updateValidatorTitlesStorage(foundedLang.validatorTitles);
          }
        });
      } else {
        updateValidatorMessagesStorage({ ...foundedLang.validatorMessages, ...foundedLang.staticValidatorMessages });
        updateValidatorTitlesStorage(foundedLang.validatorTitles);
      }
    }
    this.translocoService.setActiveLang(newLanguage.code);
  }
}
