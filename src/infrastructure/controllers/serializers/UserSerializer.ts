import User from '../../../domain/models/User';
import { UserDto } from '../dto/UserDto';

export default abstract class UserSerializer {
  public static toDto(model: User): UserDto {
    return model ? {
      email: model.email,
    } : null;
  }

  public static toModel(dto: UserDto): User {
    throw new Error('Not yet implemeted');
  }
}