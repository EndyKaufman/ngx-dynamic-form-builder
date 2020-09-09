export interface Language {
  code: string;
  title?: string;
  dictionaries?: { [key: string]: string };
}
