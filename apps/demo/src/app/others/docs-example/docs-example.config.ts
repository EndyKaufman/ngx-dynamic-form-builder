import { InjectionToken } from '@angular/core';
import { PackageConfigInterface } from './package-config.interface';

export const PACKAGE_CONFIG_TOKEN = new InjectionToken<PackageConfigInterface>(
  'package.config'
);
