import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslocoService } from '@ngneat/transloco';
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
    // t(English)
    {
      code: 'en',
      title: 'English',
      staticValidatorMessages: {
        '$constraint1 do not match to $property': '$constraint1 do not match to $property',
        'The company name must be longer than 15': 'The company name must be longer than 15',
      },
    },
    // t(Russian)
    {
      code: 'ru',
      title: 'Russian',
      staticValidatorMessages: {
        '$constraint1 do not match to $property': '$constraint1 не равно $property',
        'The company name must be longer than 15': 'Название компании должно быть длиннее 15',
      },
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
