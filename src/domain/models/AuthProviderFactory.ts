import { AuthProvider } from "./AuthProvider";
import { ProviderName } from "./AuthenticationData";

export interface AuthProviderFactory {
  get(providerName: ProviderName): AuthProvider;
}
