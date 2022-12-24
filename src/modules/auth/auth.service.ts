import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    
    constructor(
        private usersService: UsersService,
        private jwt: JwtService
    ) {}

    async login(user: any): Promise<any> {
        const payload = { username: user.username, sub: user.id, role:user.role };
 
        return { access_token: this.jwt.sign(payload) };
    }

    async validateUser(username: string, password: string): Promise<any> {
        const foundUser = await this.usersService.findOneByUsername(username);
        if (foundUser) {
            if (await bcrypt.compare(password, foundUser.password)) {
                const { password, ...result } = foundUser
                return result;
            }

            return null;
        }
        return null;
    }
}
