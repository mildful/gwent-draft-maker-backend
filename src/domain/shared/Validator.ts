import { ValidationError } from './Errors';

export class Validator {
  public static isString(value: unknown): value is string {
    return typeof value === 'string';
  }

  public static isNonEmptyString(value: unknown): value is string {
    return this.isString(value) && value.trim() !== '';
  }

  public static isNumber(value: unknown): value is number {
    return typeof value === 'number';
  }

  public static isUrl(value: unknown): boolean {
    return this.isNonEmptyString(value) && /^https?:\/\/.+$/.test(value);
  }

  public static isEmailAddress(value: unknown): boolean {
    return this.isNonEmptyString(value) && /.+@.+\..+/.test(value);
  }

  public static isNickName(value: unknown): boolean {
    return this.isNonEmptyString(value) && /^[A-Za-z][\w-]{1,31}$/.test(value);
  }

  public static isBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean';
  }

  public static isDate(value: unknown): value is Date {
    return value instanceof Date;
  }

  public static isObject(value: unknown): value is { [k: string]: unknown } {
    return !!(value && typeof value === 'object');
  }

  public static isObjectOrNonEmptyString(value: unknown): boolean {
    return this.isObject(value) || this.isNonEmptyString(value);
  }

  public static isArray(value: unknown): value is unknown[] {
    return Array.isArray(value);
  }

  public static isFunction(value: unknown): value is Function {
    return typeof value === 'function';
  }

  public static isNullOrUndefined(data: unknown): boolean {
    return data == null;
  }

  public static isStringMaxLength(maxLength: number): (data: unknown) => boolean {
    return (data: unknown) => this.isNonEmptyString(data) && data.length <= maxLength;
  }

  public static validate(value: boolean, message: string): void;
  public static validate<T>(value: T, predicate: (data: T) => boolean, message: string): void;
  public static validate<T>(
    value: T | boolean, predicateOrMessage: ((data: T) => boolean) | string, message?: string,
  ): void {
    if (this.isString(predicateOrMessage)) {
      if (value !== true) {
        throw new ValidationError(predicateOrMessage);
      }
    } else if (!predicateOrMessage.bind(this)(value)) {
      throw new ValidationError(message);
    }
  }
}
