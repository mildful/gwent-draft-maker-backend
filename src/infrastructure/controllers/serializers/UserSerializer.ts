import User from '../../../domain/models/Card';
import { UserDto } from '../dto/UserDto';

export default abstract class UserSerializer {
  public static toDto(model: User): UserDto {
    return {
      email: model.email,
    };
  }
}