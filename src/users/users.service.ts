import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { TranslationsKeys } from 'src/common/translation-keys/translations-keys';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>
  ) { }
  async create(createUserDto: CreateUserDto) {
    try {

      const { password, ...userData } = createUserDto;

      const user = this.usersRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      await this.usersRepository.save(user);
      delete (user as Partial<User>).password;
      return user;
    } catch (error) {

      if (error.code === '23505') {
        throw new BadRequestException(
          TranslationsKeys.USER_ALREADY_EXISTS
        )
      }
      throw new BadRequestException(
        TranslationsKeys.CANNONT_CREATE_USER
      )
    }
  }

}
