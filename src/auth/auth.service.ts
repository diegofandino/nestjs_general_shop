import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { TranslationsKeys } from 'src/common/translation-keys/translations-keys';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly authRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) { }

  async registerUser(registerUserDto: CreateUserDTO) {
    try {
      const user = await this.authRepository.findOne({
        where: [
          {
            email: registerUserDto.email
          }
        ]
      });

      if (user) {
        throw new BadRequestException(TranslationsKeys.USER_ALREADY_EXISTS);
      }

      const { password, ...userData } = registerUserDto;

      const newUser = await this.authRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });

      await this.authRepository.save(newUser);
      delete (newUser as Partial<User>).password;
      return {
        ...newUser,
        token: this.getJwtToken({ id: newUser.id })
      }

    } catch (error) {

      if (error.code === '23505') {
        throw new BadRequestException(TranslationsKeys.USER_ALREADY_EXISTS);
      }

      throw new InternalServerErrorException(TranslationsKeys.CANNOT_REGISTER_USER);
    }
  }

  async loginUser(loginUserDto: LoginUserDTO) {
    try {
      const user = await this.authRepository.findOne({
        where: [
          {
            email: loginUserDto.email
          }
        ],
        select: {
          email: true, password: true, id: true
        }
      });

      if (!user) {
        throw new UnauthorizedException(TranslationsKeys.USER_NOT_FOUND);
      }

      if (!bcrypt.compareSync(loginUserDto.password, user.password)) {
        throw new UnauthorizedException(TranslationsKeys.CANNOT_LOGIN_USER);
      }

      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      };


    } catch (error) {
      console.log('error', error)
      throw new InternalServerErrorException(TranslationsKeys.CANNOT_LOGIN_USER);
    }
  }

  private getJwtToken = (payload: JwtPayload) => {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
