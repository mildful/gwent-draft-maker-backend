import { AuthConfig } from "../../../domain/models/utils/Config";
import { ConfigDto } from "../dto/ConfigDto";

export abstract class ConfigSerializer {
  public static toDto(authConfig: AuthConfig): ConfigDto {
    return {
      auth: {
        twitch: {
          clientId: authConfig.twitch.clientId,
        },
      },
    };
  }
}
