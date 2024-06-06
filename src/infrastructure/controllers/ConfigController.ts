import { inject, named } from "inversify";
import { controller, httpGet } from "inversify-express-utils";
import { ApplicationConfig } from "../../domain/models/ApplicationConfig";
import { ConfigSerializer } from "./serializers/ConfigSerializer";
import { ApplicationConfigDto } from "./dto/ApplicationConfigDto";

@controller('/config')
export class ConfigController {
  constructor(
    @inject('AppConfig') private readonly appConfig: ApplicationConfig,
  ) { }

  @httpGet('')
  public getConfig(): ApplicationConfigDto {
    return ConfigSerializer.toDto(this.appConfig);
  }
}
