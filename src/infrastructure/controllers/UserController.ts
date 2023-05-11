import { inject } from "inversify";
import { controller, httpGet } from "inversify-express-utils";
import Logger from "../../domain/models/Logger";
import Clock from "../../domain/models/Clock";

@controller('/users')
export class UserController {
  constructor(
    @inject('Logger') private readonly logger: Logger,
    @inject('Clock') private readonly clock: Clock,
  ) { /* Do nothing */ }

  @httpGet('/')
  public testRoute(): void {
    this.logger.info('I am a test route!', this.clock.currentTimestamp());
  }
}
