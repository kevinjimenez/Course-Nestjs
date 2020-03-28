import {EntityRepository, Repository} from "typeorm";
import {UserEntity} from "./user.entity";
import {AuthCredentialsDto} from "./dto/auth-credentials.dto";
import {ConflictException, InternalServerErrorException} from "@nestjs/common";
import * as bcrypt from 'bcrypt';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const {password, username} = authCredentialsDto;

        const user = new UserEntity();
        user.username = username;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);
        try {
            await user.save();
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('username already exist');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const {password, username} = authCredentialsDto;
        const user = await this.findOne({username});

        if (user && await user.validatePassword(password)) {
            return user.username
        } else {
            return null;
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }

}
