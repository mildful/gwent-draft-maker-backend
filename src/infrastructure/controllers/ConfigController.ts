import { inject, named } from "inversify";
import { controller, httpGet } from "inversify-express-utils";
import { AuthConfig } from "../../domain/models/utils/Config";
import { ConfigSerializer } from "./serializers/ConfigSerializer";
import { ConfigDto } from "./dto/ConfigDto";

@controller('/config')
export class ConfigController {
  constructor(
    @inject('Config') @named('Auth') private readonly authConfig: AuthConfig,
  ) { }

  @httpGet('')
  public getConfig(): ConfigDto {
    return ConfigSerializer.toDto(this.authConfig);
  }
}
