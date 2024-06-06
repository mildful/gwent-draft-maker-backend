import * as bcrypt from 'bcrypt';
import Hash from "../../domain/models/utils/Hash";
import { ServerError } from '../../domain/shared/Errors';

export default class BcryptHash implements Hash {
  public hash(input: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(input, 10, function (err, hash) {
        if (err) {
          reject(err);
        } else {
          resolve(hash);
        }
      });
    });
  }

  public async compare(plainText: string, hash: string): Promise<boolean> {
    try {
      const result = await bcrypt.compare(plainText, hash);
      return result;
    } catch (err) {
      throw new ServerError('[BcryptHash][compare] Failed to compare');
    }
  }
}