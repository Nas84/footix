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
import { TeamsService } from './teams.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTeamDto, TeamDto, UpdateTeamDto } from './dto/';

@Controller('api/teams')
@ApiTags('Teams')
@ApiBearerAuth()
export class TeamsController {
  constructor(private teamsService: TeamsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Finds all teams' })
  @ApiOkResponse({ description: 'Return all teams', type: [TeamDto] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'No team found' })
  async getAll(): Promise<TeamDto[]> {
    return this.teamsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Finds a team by its id' })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Return a team', type: TeamDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Team not found' })
  async getById(@Param('id') id: string): Promise<TeamDto> {
    try {
      return await this.teamsService.findOneById(id);
    } catch (err) {
      throw new NotFoundException();
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new team' })
  @ApiBody({ type: CreateTeamDto })
  @ApiOkResponse({ description: 'The team has been successfully created.', type: TeamDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Team not found' })
  async create(@Body() team: CreateTeamDto): Promise<any> {
    return this.teamsService.create(team);
  }

  @Put(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update an existing team' })
  @ApiParam({ name: 'id', type: String })
  @ApiNoContentResponse({ description: 'The team has been successfully updated.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Team not found' })
  @ApiBody({ type: UpdateTeamDto })
  async update(@Param('id') id: string, @Body() team: UpdateTeamDto): Promise<any> {
    const result = await this.teamsService.update(id, team);

    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a team' })
  @ApiParam({ name: 'id', type: String })
  @ApiNoContentResponse({ description: 'The team has been successfully deleted.' })
  @ApiNotFoundResponse({ description: 'Team not found' })
  async delete(@Param('id') id: string): Promise<any> {
    const result = await this.teamsService.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }
}
