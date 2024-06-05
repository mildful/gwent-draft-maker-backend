import { inject, named } from "inversify";
import {
  controller,
  requestParam,
  httpPost,
  requestBody,
} from "inversify-express-utils";
import { AuthService } from '../../application/services/AuthService';
import { SessionTokenDto } from './dto/SessionTokenDto';
import { SessionSerializer } from './serializers/SessionSerializer';
import { ServerError } from "../../domain/shared/Errors";

@controller('/auth')
export class AuthController {
  constructor(
    @inject('Service') @named('Auth') private readonly authService: AuthService,
  ) { }

  @httpPost('/:provider(twitch)')
  public async authenticateWithProvider(
    @requestParam('provider') providerName: string,
    @requestBody() parameters: { code: string },
  ): Promise<SessionTokenDto> {
    if (providerName === 'twitch') {
      const token = await this.authService.loginOrRegisterWithTwitch(parameters.code);
      return SessionSerializer.toDto(token);
    } else {
      throw new ServerError('Something went wrong.');
    }
  }
}
