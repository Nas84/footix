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
import {
  ApiBody,
  ApiTags,
  ApiParam,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiBearerAuth
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserDto, SignupUserDto, UpdateUserDto, UserDto } from './dto/';

@ApiTags('Users')
@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Signup and create a new user' })
  @ApiBody({ type: [SignupUserDto] })
  async signup(@Body() user: SignupUserDto): Promise<UserDto> {
    return this.usersService.create(user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Finds all users' })
  @ApiOkResponse({ description: 'Return the list of users', type: [UserDto] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async findAll(): Promise<UserDto[]> {
    return this.usersService.findAll();
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Finds a user by its id' })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Return a user', type: UserDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async findById(@Param('id') id: string): Promise<UserDto> {
    try {
      return await this.usersService.findOneById(id);
    } catch (err) {
      throw new NotFoundException(`User ${id} not found`);
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: [CreateUserDto] })
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    type: UserDto
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post()
  async create(@Body() user: CreateUserDto): Promise<UserDto> {
    return this.usersService.create(user);
  }

  @Put('/:id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: [UpdateUserDto] })
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async update(@Param('id') id: string, @Body() user: UpdateUserDto): Promise<any> {
    const result = await this.usersService.update(id, user);

    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }

  @Delete('/:id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', type: String })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async delete(@Param('id') id: string): Promise<any> {
    const result = await this.usersService.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }
}
