import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('api/auth/')
export class AuthController {

    constructor(private authService: AuthService) { }

    @UseGuards(LocalAuthGuard)
    @ApiTags('Auth')
    @Post('login')
    async login(@Request() req) {
        return this.authService.login(req.user)
    }

}
