import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe implements PipeTransform {
  constructor(public _sanitizer: DomSanitizer) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform(value: string): any {
    if (this._sanitizer) {
      return this._sanitizer.bypassSecurityTrustHtml(value);
    } else {
      return value;
    }
  }
}
