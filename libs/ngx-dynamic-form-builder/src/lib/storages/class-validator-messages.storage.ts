import { getClassValidatorMessagesStorage } from 'class-validator-multi-lang';
import { BehaviorSubject } from 'rxjs';
import { getGlobal } from '../utils/get-global.util';

const CLASS_VALIDATOR_MESSAGES_STORAGE = 'CLASS_VALIDATOR_MESSAGES_STORAGE';

export function getValidatorMessagesStorage(): BehaviorSubject<{
  [key: string]: string;
}> {
  const global = getGlobal();
  if (!global[CLASS_VALIDATOR_MESSAGES_STORAGE]) {
    global[CLASS_VALIDATOR_MESSAGES_STORAGE] = new BehaviorSubject(getClassValidatorMessagesStorage());
  }
  return global[CLASS_VALIDATOR_MESSAGES_STORAGE];
}

export function updateValidatorMessagesStorage(messages: { [key: string]: string }) {
  getValidatorMessagesStorage().next(messages);
}
