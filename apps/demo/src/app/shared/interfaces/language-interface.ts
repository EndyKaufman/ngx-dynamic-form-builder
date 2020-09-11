export interface Language {
  code: string;
  title?: string;
  validatorMessages?: { [key: string]: string };
  validatorTitles?: { [key: string]: string };
  staticValidatorMessages?: { [key: string]: string };
  staticValidatorTitles?: { [key: string]: string };
}
