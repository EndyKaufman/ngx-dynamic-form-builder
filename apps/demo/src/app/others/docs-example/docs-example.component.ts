// external
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Input,
  Optional,
  ViewEncapsulation,
} from '@angular/core';
// internal
import { DocsExampleClass } from './docs-example.class';
import { PACKAGE_CONFIG_TOKEN } from './docs-example.config';
import { LaunchInterface } from './docs-example.interface';
import { PackageConfigInterface } from './package-config.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./docs-example.scss'],
  selector: 'ngx-docs-example',
  templateUrl: './docs-example.component.html',
})
export class DocsExampleComponent extends DocsExampleClass {
  private element: ElementRef;

  @Input()
  set config(config: PackageConfigInterface | undefined) {
    this.setStyle(config);
  }

  @Input()
  css: string | undefined;

  @Input()
  html: string | undefined;

  @Input()
  launch: LaunchInterface | undefined;

  @Input()
  title: string | undefined;

  @Input()
  ts: string | undefined;

  @Input()
  customClass!: string;

  openLocation() {
    if (this.launch) {
      if (this.launch.location) {
        window.open(this.launch.location, '_blank');
      }
    }
  }

  constructor(
    element: ElementRef,
    @Optional()
    @Inject(PACKAGE_CONFIG_TOKEN)
    config?: PackageConfigInterface | undefined
  ) {
    super({
      code: {
        active: false,
        tooltip: 'View code',
      },
      debug: {
        active: false,
        tooltip: 'Debug code',
      },
    });
    this.element = element;
    this.setStyle(config);
  }

  setStyle(config?: PackageConfigInterface | undefined): void {
    if (config) {
      for (const key in config) {
        if (key) {
          this.setProperty(key as keyof PackageConfigInterface, config);
        }
      }
    }
  }

  private setProperty(
    name: keyof PackageConfigInterface,
    config: PackageConfigInterface | undefined
  ): void {
    if (config) {
      this.element.nativeElement.style.setProperty(
        `--ngx-docs-example-${name.replace(/_/g, '-')}`,
        config[name]
      );
    }
  }
}
