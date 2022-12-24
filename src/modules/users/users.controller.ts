import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UserRole } from './user.role'
import { ApiBody, ApiTags, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@ApiTags('Users')
@Controller('api/users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @ApiBody({ type: [User] })
    @Post('signup')
    async signup(@Body() user: User): Promise<User> {
        user.role = UserRole.User;
        return this.usersService.create(user);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @ApiParam({ name: 'id', type: String })
    @Get('/:id')
    findById(@Param('id') id : string): Promise<User> {
        return this.usersService.findOneById(id);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBody({ type: [User] })
    @Post()
    async create(@Body() user: User): Promise<any> {
        return this.usersService.create(user);
    }

    @UseGuards(JwtAuthGuard)
    @ApiParam({ name: 'id', type: String })
    @ApiBody({ type: [User] })
    @Put('/:id')
    async update(@Param('id') id : string, @Body() user : User): Promise<any> {
        return this.usersService.update(id, user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/:id')
    async delete(@Param('id') id : string ): Promise<any> {
        return this.usersService.delete(id);
    }
}
