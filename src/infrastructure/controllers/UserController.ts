import { inject, named } from "inversify";
import { controller, httpGet, httpPost, queryParam, requestBody } from "inversify-express-utils";
import Logger from "../../domain/models/utils/Logger";
import { UserDto } from './dto/UserDto';
import UserService from "../../application/services/UserService";
import UserSerializer from './serializers/UserSerializer';

@controller('/users')
export class UserController {
  constructor(
    @inject('Service') @named('User') private readonly userService: UserService,
    @inject('Logger') private readonly logger: Logger,
  ) { /* Do nothing */ }

  // @httpPost('')
  // public async createUser(@requestBody() body: { email: string }): Promise<UserDto> {
  //   const newUser = await this.userService.createUser({
  //     email: body.email,
  //   });
  //   return UserSerializer.toDto(newUser);
  // }

  // @httpGet('')
  // public async getUser(@queryParam('email') email: string): Promise<UserDto> {
  //   const newUser = await this.userService.testGetUser(email);
  //   return UserSerializer.toDto(newUser);
  // }
}
