import { Injector, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe implements PipeTransform {
  private _sanitizer: DomSanitizer;

  constructor(
    public injector: Injector
  ) {
    this._sanitizer = injector.get(DomSanitizer);
  }

  transform(value: string, args: any): any {
    if (this._sanitizer) {
      return this._sanitizer.bypassSecurityTrustHtml(value);
    } else {
      return value;
    }
  }
}
