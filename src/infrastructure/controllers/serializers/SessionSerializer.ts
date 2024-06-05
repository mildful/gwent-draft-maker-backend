import { SessionToken } from "../../../domain/models/Session";
import { SessionTokenDto } from "../dto/SessionTokenDto";

export abstract class SessionSerializer {
  public static toDto(token: SessionToken): SessionTokenDto {
    return {
      expiresIn: token.expiresIn,
      token: token.token,
    };
  }
}
