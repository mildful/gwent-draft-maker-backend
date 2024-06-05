import { Validator } from "../shared/Validator";
import { AuthenticationData, CreateAuthenticationDataParams } from "./AuthenticationData";
import { Id } from "./utils/Id";

export interface CreateUserParams {
  id?: string;
  email: string;
  // sessionToken?: string;
  authenticationData: CreateAuthenticationDataParams;
}

interface UserState {
  id: Id,
  email: string;
  // sessionToken: string,
  authenticationData: AuthenticationData,
}

export default class User {
  private _state: UserState;

  public get id(): Id { return this._state.id; }

  public get email(): string { return this._state.email; }
  public set email(value: string) {
    Validator.validate(value, Validator.isEmailAddress, `[User][constructor] Invalid email: ${value}`);
    this._state.email = value;
  }

  // public get sessionToken(): string { return this._state.sessionToken; }
  // public set sessionToken(value: string) {
  //   this._state.sessionToken = value ? value.trim() : null;
  // }

  public get authenticationData(): AuthenticationData { return this._state.authenticationData; }

  constructor(params: CreateUserParams) {
    Validator.validate(params, Validator.isObject, '[User][constructor] params must be an object');
    
    if (params.id) {
      Validator.validate(Id.isValid(params.id), `[User][constructor] Invalid id: ${params.id}`);
    }

    this._state = {
      id: params.id || Id.create(),
      email: null,
      // sessionToken: null,
      authenticationData: new AuthenticationData(params.authenticationData),
    };

    this.email = params.email;
    // this.sessionToken = params.sessionToken;
  }

  public static isValid(data: unknown): data is User {
    return data instanceof User;
  }
}
