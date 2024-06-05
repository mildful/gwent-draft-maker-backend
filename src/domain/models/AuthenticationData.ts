import { ProviderNotFoundError } from "../errors/ProviderNotFoundError";
import { Validator } from "../shared/Validator";

export enum ProviderName {
  Twitch = 'twitch',
}

export type AccessToken = string;

export interface Tokens {
  accessToken: AccessToken,
  expiresAt: number, // absolute
  refreshToken: string,
  scope: string[],
  profileId: string,
}

export type CreateAuthenticationDataParams = {
  [providerName in ProviderName]?: Tokens;
}

type AuthenticationDataState = {
  [providerName in ProviderName]?: Tokens;
}

export class AuthenticationData {
  private _state: AuthenticationDataState;

  constructor(params: CreateAuthenticationDataParams) {
    Validator.validate(params, Validator.isObject, '[AuthenticationData][constructor] params must be an object');

    this._state = params;
  }

  public getTokens(providerName: ProviderName): Tokens {
    const provider = this._state[providerName];
    if (!provider) {
      throw new ProviderNotFoundError({ providerName });
    }
    return provider;
  }
}
