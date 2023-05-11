import { randomUUID } from 'crypto';
import { Validator } from '../shared/Validator';

const lowerCaseUuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

export type Id = string;

// eslint-disable-next-line no-redeclare
export namespace Id {
  export function create(): Id {
    return randomUUID();
  }

  export function isValid(data: unknown): data is Id {
    return Validator.isNonEmptyString(data) && lowerCaseUuidV4Regex.test(data);
  }
}
