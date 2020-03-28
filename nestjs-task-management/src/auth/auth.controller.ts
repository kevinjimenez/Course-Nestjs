import {Body, Controller, Post, UnauthorizedException, ValidationPipe} from '@nestjs/common';
import {AuthCredentialsDto} from "./dto/auth-credentials.dto";
import {AuthService} from "./auth.service";

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {
    }

    @Post('/signUp')
    async signUp(
        @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto
    ): Promise<void> {
        return this.authService.signUp(authCredentialsDto);
    }

    @Post('/signIn')
    async signIp(
        @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto
    ) {
        const username = await this.authService.signIn(authCredentialsDto);
        if (!username) {
            throw new UnauthorizedException('Ivanlid credencials')
        }
    }

}
