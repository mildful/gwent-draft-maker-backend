import { Strategy } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { injectable, inject, named } from 'inversify';
import UserRepository from '../../repositories/UserRepository';
import AuthStrategy from './AuthStrategy';
import Hash from '../../../domain/models/utils/Hash';
import { ForbiddenError } from '../../../domain/shared/Errors';
import { UserNotFoundError } from '../../../domain/errors/UserNotFoundError';
import Logger from '../../../domain/models/utils/Logger';

@injectable()
export default class LocalAuthStrategy implements AuthStrategy {
  private strategy: Strategy;

  constructor(
    @inject('Logger') private readonly logger: Logger,
    @inject('Hash') private readonly hash: Hash,
    @inject('Repository') @named('User') private readonly userRepository: UserRepository,
  ) {
    this.strategy = new LocalStrategy(async (email, password, done) => {
      try {
        this.logger.info(`[LocalAuthStrategy][constructor] Getting the user by the email`, { email });
        const user = await this.userRepository.getByEmail(email);

        if (!user) {
          return done(new UserNotFoundError({ email }), false);
        }

        const isPwdValid = await this.hash.compare(password, user.password);
        if (!isPwdValid) {
          return done(new ForbiddenError('Invalid password.'));
        }

        done(null, user);
      } catch (err) {
        done(err);
      }
    });
  }

  getStrategy(): Strategy {
    return this.strategy;
  }
}