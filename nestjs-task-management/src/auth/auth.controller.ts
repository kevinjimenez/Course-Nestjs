import {Body, Controller, Post, Req, UseGuards, ValidationPipe} from '@nestjs/common';
import {AuthCredentialsDto} from "./dto/auth-credentials.dto";
import {AuthService} from "./auth.service";
import {AuthGuard} from "@nestjs/passport";
import {GetUser} from "./get-user.decorator";
import {UserEntity} from "./user.entity";

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
    signIp(
        @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto
    ) {
        return this.authService.signIn(authCredentialsDto);
    }

    // header
    // Authorization -> Bearer (token)
    @Post('/test')
    @UseGuards(AuthGuard())
    test(@GetUser() user: UserEntity) {
        console.log(user);
    }

}
