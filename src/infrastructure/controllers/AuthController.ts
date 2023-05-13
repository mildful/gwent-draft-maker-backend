import { inject, named } from "inversify";
import {
  controller,
  requestParam,
  httpPost,
  requestBody,
} from "inversify-express-utils";
import UserService from '../../application/services/UserService';
import { SessionTokenDto } from './dto/SessionTokenDto';

@controller('/auth')
export class AuthController {
  constructor(
    @inject('Service') @named('User') private readonly userService: UserService,
  ) { }

  // @httpPost('/:provider(twitch)')
  // public async authenticateWithProvider(
  //   @requestParam('provider') provider: string, @requestBody() parameters: { providerToken: string },
  // ): Promise<SessionTokenDto> {
  //   const playerInfo = await this.userService.getPlayerByProvider({ provider, parameters });
  //   if (!playerInfo?.player) {
  //     throw new PlayerNotFoundError({ email: playerInfo.email, token: playerInfo.jwtAccountCreation });
  //   }

  //   if (!playerInfo.player.emailVerified || playerInfo.player.requiresMfa) {
  //     await this.verifyMfa(parameters, playerInfo.player);
  //   }

  //   if (!playerInfo.player.emailVerified) {
  //     playerInfo.player = await this.playerService.verifyEmailPlayer(playerInfo.player);
  //   }

  //   return SessionTokenSerializer.serialize(await this.sessionProvider.generateToken(playerInfo.player));
  // }
}
