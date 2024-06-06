import { Validator } from "../shared/Validator";
import { Id } from "./utils/Id";

export interface CreateUserParams {
  id?: string;
  email: string;
  password: string;
}

interface UserState {
  id: Id,
  email: string;
  password: string;
}

export default class User {
  private _state: UserState;

  public get id(): Id { return this._state.id; }

  public get email(): string { return this._state.email; }
  public set email(value: string) {
    Validator.validate(value, Validator.isEmailAddress, `[User][constructor] Invalid email: ${value}`);
    this._state.email = value;
  }

  public set password(value: string) {
    Validator.validate(value, Validator.isString, `[User][Constructor] Password must be a string: ${value}`);
  }

  constructor(params: CreateUserParams) {
    Validator.validate(params, Validator.isObject, '[User][constructor] params must be an object');

    if (params.id) {
      Validator.validate(Id.isValid(params.id), `[User][constructor] Invalid id: ${params.id}`);
    }

    this._state = {
      id: params.id || Id.create(),
      email: '',
      password: '',
    };

    this.email = params.email;
    this.password = params.password;
  }

  public static validatePassword(password: string): boolean {
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(password);
  }

  public static isValid(data: unknown): data is User {
    return data instanceof User;
  }
}
