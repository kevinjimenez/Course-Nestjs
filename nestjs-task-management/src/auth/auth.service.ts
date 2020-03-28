import {Injectable, Logger, UnauthorizedException} from '@nestjs/common';
import {UserRepository} from "./user.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {AuthCredentialsDto} from "./dto/auth-credentials.dto";
import {JwtService} from "@nestjs/jwt";
import {JwtPayloadInterface} from "./jwt-payload.interface";

@Injectable()
export class AuthService {
    private looger = new Logger('AuthService');
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
    ) {
    }

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.userRepository.signUp(authCredentialsDto);
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken }> {
        const username = await this.userRepository.validateUserPassword(authCredentialsDto);
        if (!username) {
            throw new UnauthorizedException('Ivanlid credencials')
        }

        const payload: JwtPayloadInterface = {username};
        const accessToken = await this.jwtService.sign(payload);
        this.looger.debug(`Generated JWT token with payload ${JSON.stringify(payload)}`);
        return {accessToken}
    }
}
