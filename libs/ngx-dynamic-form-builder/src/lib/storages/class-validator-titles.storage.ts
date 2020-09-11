import { BehaviorSubject } from 'rxjs';
import { getGlobal } from '../utils/get-global.util';

const CLASS_VALIDATOR_TITLES_STORAGE = 'CLASS_VALIDATOR_TITLES_STORAGE';

export function getValidatorTitlesStorage(): BehaviorSubject<
  | {
      [key: string]: string;
    }
  | undefined
> {
  const global = getGlobal();
  if (!global[CLASS_VALIDATOR_TITLES_STORAGE]) {
    global[CLASS_VALIDATOR_TITLES_STORAGE] = new BehaviorSubject({});
  }
  return global[CLASS_VALIDATOR_TITLES_STORAGE];
}

export function updateValidatorTitlesStorage(titles: { [key: string]: string } | undefined) {
  getValidatorTitlesStorage().next(titles);
}
