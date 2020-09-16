import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { marker } from '@ngneat/transloco-keys-manager/marker';
import { DynamicFormBuilder, DynamicFormGroup } from 'ngx-dynamic-form-builder';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Language } from '../../shared/interfaces/language-interface';
import { Company } from './../../shared/models/company';

@Component({
  selector: 'i18n-company-panel',
  templateUrl: './i18n-company-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class I18nCompanyPanelComponent implements OnInit {
  langs: Language[] = [
    {
      code: 'en',
      title: 'English',
      staticValidatorTitles: { regionNum: 'number of region' },
    },
    {
      code: 'ru',
      title: 'Russian',
      staticValidatorTitles: { regionNum: 'региональный номер' },
    },
  ];
  form: DynamicFormGroup<Company>;

  @Input()
  item = new Company({
    id: 11,
    name: '123456789012345',
    regionNum: 1,
  });

  @Input()
  strings = Company.strings;

  fb = new DynamicFormBuilder();

  savedItem?: Company;

  constructor(private httpClient: HttpClient) {
    this.form = this.fb.group(
      Company,
      {
        name: '',
        regionNum: 0,
      },
      {
        classValidatorOptions: {
          // this values overrided after change local active language
          titles: { regionNum: 'number of region (first time)' },
        },
      }
    );
  }
  ngOnInit(): void {
    this.form.object = new Company({
      name: '',
      regionNum: 0,
    });
    this.form.validateAllFormFields();
  }
  onLoadClick(): void {
    this.savedItem = undefined;
    this.form.object = this.item;
    this.form.validateAllFormFields();
  }
  onClearClick(): void {
    this.savedItem = undefined;
    this.form.object = new Company();
    this.form.validateAllFormFields();
  }
  onSaveClick(): void {
    this.form.validateAllFormFields();
    if (this.form.valid) {
      this.savedItem = this.form.object;
    } else {
      this.savedItem = undefined;
    }
  }
  changeLanguage(newLanguageCode: MatSelectChange) {
    const foundedLang = this.langs.find((lang) => lang.code === newLanguageCode.value);
    if (foundedLang) {
      if (!foundedLang.validatorMessages) {
        forkJoin({
          messages: this.httpClient
            .get<{ [key: string]: string }>(
              `${document.baseURI}assets/i18n/class-validator-messages/${newLanguageCode.value}.json`
            )
            .pipe(catchError(() => of({}))),
          titles: this.httpClient
            .get<{ [key: string]: string }>(`${document.baseURI}assets/i18n/${newLanguageCode.value}.json`)
            .pipe(catchError(() => of({}))),
        }).subscribe(({ messages, titles }) => {
          if (foundedLang) {
            foundedLang.validatorMessages = messages;
            foundedLang.validatorTitles = titles;
            this.form.setValidatorOptions({
              messages: {
                ...foundedLang.validatorMessages,
                ...foundedLang.staticValidatorMessages,
                ...foundedLang.validatorTitles,
                ...foundedLang.staticValidatorTitles,
              },
              titles: {
                ...foundedLang.validatorTitles,
                ...foundedLang.staticValidatorTitles,
              },
            });
          }
        });
      } else {
        this.form.setValidatorOptions({
          messages: {
            ...foundedLang.validatorMessages,
            ...foundedLang.staticValidatorMessages,
            ...foundedLang.validatorTitles,
            ...foundedLang.staticValidatorTitles,
          },
          titles: {
            ...foundedLang.validatorTitles,
            ...foundedLang.staticValidatorTitles,
          },
        });
      }
    }
  }
}
