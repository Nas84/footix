import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  NotFoundException
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UserRole } from './user.role';
import { ApiBody, ApiTags, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Users')
@Controller('api/users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @ApiBody({ type: [User] })
    @Post('signup')
    async signup(@Body() user: User): Promise<User> {
        user.role = UserRole.User;
        return this.usersService.create(user);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @ApiParam({ name: 'id', type: String })
    @Get('/:id')
    async findById(@Param('id') id: string): Promise<User> {
        try {
            return await this.usersService.findOneById(id);
        } catch(err) {
            throw new NotFoundException(`User ${id} not found`);
        }
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
    @HttpCode(204)
    async update(@Param('id') id: string, @Body() user: User): Promise<any> {
        const result = await this.usersService.update(id, user);

        if (result.affected === 0) {
            throw new NotFoundException();
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/:id')
    @HttpCode(204)
    async delete(@Param('id') id: string): Promise<any> {
        const result = await this.usersService.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException();
        }
    }
}
