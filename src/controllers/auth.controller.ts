import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CognitoService } from 'src/services/cognito.service';
import { SignUpConfirmDto, SignUpDto } from 'src/types/SignUpDto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cognitoService: CognitoService,
  ) {}

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<{ token: string }> {
    const token = await this.authService.authenticate(username, password);
    return { token };
  }

  @Post('signup')
  async signUp(
    @Body()
    body: SignUpDto,
  ): Promise<void> {
    const { name, username, password, email } = body;
    await this.cognitoService.createUser(name, username, password, email);
  }

  @Post('signup/confirm')
  async confirm(
    @Body()
    body: SignUpConfirmDto,
  ): Promise<void> {
    const { username, code } = body;
    await this.cognitoService.confirmEmail(username, code);
  }
}
