import { AuthProvider } from "../../../domain/models/AuthProvider";
import { AuthProviderFactory } from "../../../domain/models/AuthProviderFactory";
import { ProviderName } from "../../../domain/models/AuthenticationData";
import { ProviderNotFoundError } from "../../../domain/errors/ProviderNotFoundError";
import { AuthConfig } from "../../../domain/models/utils/Config";
import HttpClient from "../../../domain/models/utils/HttpClient";
import Clock from "../../../domain/models/utils/Clock";
import { TwitchProvider } from "./TwitchProvider";

export class BasicAuthProviderFactory implements AuthProviderFactory {
  private map: Map<ProviderName, AuthProvider> = new Map<ProviderName, AuthProvider>();

  constructor(
    private readonly authConfig: AuthConfig,
    private readonly http: HttpClient,
    private readonly clock: Clock,
  ) {
    this.map.set(ProviderName.Twitch, new TwitchProvider(this.authConfig, this.http, this.clock));
  }

  public get(providerName: ProviderName): AuthProvider {
    const provider = this.map.get(providerName);
    if (!provider) {
      throw new ProviderNotFoundError({ providerName });
    }
    return provider;
  }
}
