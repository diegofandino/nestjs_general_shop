import { Body, Controller, Get, Post, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorator/get-user.decorator';
import { User } from './entities/user.entity';
import { GetRawHeadersDecoratos } from './decorator/get-rawDecotaros.decorator';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorator/valid-roles.decorator';
import { ValidRoles } from './interfaces/valid-roles.interface';
import { Auth } from './decorator/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  /*  @Post()
   create(@Body() createAuthDto: CreateAuthDto) {
     return this.authService.create(createAuthDto);
   } */

  @Post('register')
  register(@Body() registerUserDto: CreateUserDTO) {
    return this.authService.registerUser(registerUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDTO) {
    return this.authService.loginUser(loginUserDto);
  }

  @Get('private')
  @UseGuards(AuthGuard('jwt'))
  privateRoute(
    @GetRawHeadersDecoratos() rawHeaders: string[],
    @GetUser() user: User,
    @GetUser('email') userData: User
  ) {

    console.log(rawHeaders);

    return {
      ok: true,
      user,
      userData
    }
  }


  // @SetMetadata('roles', ['admin', 'super-user'])

  @Get('private2')
  @RoleProtected(ValidRoles.SUPER_USER)
  @UseGuards(AuthGuard('jwt'), UserRoleGuard)
  private2(@GetUser() user: User) {
    return {
      ok: true,
      user
    }
  }

  @Get('private3')
  @Auth(ValidRoles.SUPER_USER)
  private3(@GetUser() user: User) {
    return {
      ok: true,
      user
    }
  }

  /*   @Get()
    findAll() {
      return this.authService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.authService.findOne(+id);
    }
  
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
      return this.authService.update(+id, updateAuthDto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.authService.remove(+id);
    } */
}
