import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  readme: SafeHtml;
  constructor(
    private _sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.readme = this._sanitizer.bypassSecurityTrustHtml(
      require('html-loader!markdown-loader!./../../../../../../README.md').
      replace('<h1 id="ngx-dynamic-form-builder">ngx-dynamic-form-builder</h1>', '')
    );
  }

}
