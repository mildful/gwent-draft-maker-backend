import { ApplicationConfig } from "../../../domain/models/ApplicationConfig";
import { ApplicationConfigDto } from "../dto/ApplicationConfigDto";

export abstract class ConfigSerializer {
  public static toDto(authConfig: ApplicationConfig): ApplicationConfigDto {
    return {
      // TODO: something here
    };
  }
}
