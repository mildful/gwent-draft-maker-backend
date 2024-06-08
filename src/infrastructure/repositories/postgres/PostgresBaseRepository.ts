import { Client } from "pg";
import Logger from "../../../domain/models/utils/Logger";
import { inject, injectable } from "inversify";

@injectable()
export default class PostgresBaseRepository {
  constructor(
    @inject('Logger') private readonly logger: Logger,
    @inject('PgClient') private readonly client: Client,
  ) { }
}
