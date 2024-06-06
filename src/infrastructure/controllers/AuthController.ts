import { inject, named } from "inversify";
import {
  controller,
  requestParam,
  httpPost,
  request,
  requestBody,
  next,
} from "inversify-express-utils";
import { AuthService } from '../../application/services/AuthService';
import UserSerializer from "./serializers/UserSerializer";
import { UserDto } from "./dto/UserDto";
import { Validator } from "../../domain/shared/Validator";
import { ValidationError } from "../../domain/shared/Errors";
import AuthProvider from "../providers/auth/AuthProvider";
import { NextFunction } from "express";

@controller('/auth')
export class AuthController {
  constructor(
    @inject('Service') @named('Auth') private readonly authService: AuthService,
    @inject('AuthProvider') private readonly authProvider: AuthProvider,
  ) { }

  @httpPost('/signup')
  public async signup(
    @requestBody() body: any,
  ): Promise<UserDto> {
    const { email, password } = body;

    try {
      Validator.validate(email, Validator.isNonEmptyString, 'You must provide an email');
      Validator.validate(password, Validator.isNonEmptyString, 'You must provide a password');
    } catch (err) {
      throw new ValidationError(err);
    }

    const user = await this.authService.signup({ email, password });

    return UserSerializer.toDto(user);
  }

  @httpPost('/:provider(local)')
  public async login(
    @requestParam('provider') providerName: string,
    @request() req: Express.Request,
    @next() next: NextFunction,
  ): Promise<UserDto> {
    const user = await this.authService.login(providerName, req, next);
    return UserSerializer.toDto(user);
  }
}
