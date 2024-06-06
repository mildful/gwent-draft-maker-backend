import { getAuth } from "firebase-admin/auth";
import AuthProvider from "./AuthProvider";
import { inject, injectable } from "inversify";
import Logger from "../../../domain/models/utils/Logger";
import { ServerError } from "../../../domain/shared/Errors";

@injectable()
export default class FirebaseAuthProvider implements AuthProvider {
  constructor(
    @inject('Logger') private readonly logger: Logger,
  ) { }

  public async verifyToken(token: string): Promise<string> {
    try {
      const decodedToken = await getAuth().verifyIdToken(token);
      return decodedToken.sub;
    } catch (err) {
      this.logger.error(`[FirebaseAuthProvider][signWithEmail] Unexpected error.`);
      throw new ServerError();
    }
  }
}