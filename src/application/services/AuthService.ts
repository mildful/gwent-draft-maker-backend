import { inject, injectable, named } from "inversify";
import { AuthProviderFactory } from "../../domain/models/AuthProviderFactory";
import { ProviderName } from "../../domain/models/AuthenticationData";
import UserService from "./UserService";
import Logger from "../../domain/models/utils/Logger";
import { AbstractJwtSessionProvider } from "../../infrastructure/providers/session/AbstractJwtSessionProvider";
import { SessionToken } from "../../domain/models/Session";

@injectable()
export class AuthService {
  constructor(
    @inject('Factory') @named('AuthProvider') private readonly authFactory: AuthProviderFactory,
    @inject('Service') @named('User') private readonly userService: UserService,
    @inject('Provider') @named('Session') private readonly sessionProvider: AbstractJwtSessionProvider,
    @inject('Logger') private readonly logger: Logger,
  ) { }

  // todo: could be loginOrRegisterWithProvider and takes in the ProviderName
  public async loginOrRegisterWithTwitch(code: string): Promise<SessionToken> {
    const authProvider = this.authFactory.get(ProviderName.Twitch);

    // this.logger.info('[AuthService][loginOrRegisterWithTwitch] Retrieving tokens...');
    // const tokens = await authProvider.getTokensFromCode(code);

    // this.logger.info('[AuthService][loginOrRegisterWithTwitch] Getting user infos...');
    // const twitchUserInfos = await authProvider.getUserInfos(tokens.accessToken);

    // const user = await this.userService.createNewUser({
    //   email: twitchUserInfos.email,
    //   // todo : maybe replace this with a user.addAuthProvider() ?
    //   authData: { [ProviderName.Twitch]: tokens },
    // });

    // return this.sessionProvider.generateToken(user);
  }
}