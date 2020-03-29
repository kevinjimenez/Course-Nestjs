import {PassportStrategy} from "@nestjs/passport";
import {Strategy, ExtractJwt} from "passport-jwt";
import {JwtPayloadInterface} from "./jwt-payload.interface";
import {UserRepository} from "./user.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "./user.entity";
import {Injectable, UnauthorizedException} from "@nestjs/common";
import * as config from 'config'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('jwt.secret')
        })
    }

    async validate(payload: JwtPayloadInterface): Promise<UserEntity> {
        const {username} = payload;
        const user = await this.userRepository.findOne({username});

        if (!user) {
            throw new UnauthorizedException('')
        }
        return user;
    }
}
