import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';

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
  privateRoute() {
    return {
      ok: true,
      message: 'private secret'
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
