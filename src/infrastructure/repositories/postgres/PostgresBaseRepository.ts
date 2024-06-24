import { injectable } from "inversify";
import Logger from "../../../domain/models/utils/Logger";
import { DomainError, ServerError } from "../../../domain/shared/Errors";

@injectable()
export default class PostgresBaseRepository {
  constructor(
    protected readonly logger: Logger,
  ) { }

  protected getError(error: Error, dbMessage: string, domainMessage: string): Error {
    if (!DomainError.isDomainError(error)) {
      // is a DB error, we don't want to expose this to the client
      // return a generic error
      // for more information, check the error.code: https://www.postgresql.org/docs/current/errcodes-appendix.html
      this.logger.error(dbMessage, error);
      return new ServerError();
    } else {
      // is a domain error, most likely due to the serializer
      this.logger.error(domainMessage);
      return error;
    }
  }
}
