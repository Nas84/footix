import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { Team } from './team.entity';
import { TeamsService } from './teams.service';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@ApiTags('Teams')
@Controller('api/teams')
export class TeamsController {

    constructor(private teamsService: TeamsService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    getAll(): Promise<Team[]> {
        return this.teamsService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @ApiParam({ name: 'id', type: String })
    @Get('/:id')
    getById(@Param('id') id : string): Promise<Team> {
        return this.teamsService.findOneById(id);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBody({ type: [Team] })
    @Post()
    async create(@Body() team: Team): Promise<any> {
        return this.teamsService.create(team);
    }

    @UseGuards(JwtAuthGuard)
    @ApiParam({ name: 'id', type: String })
    @ApiBody({ type: [Team] })
    @Put('/:id')
    async update(@Param('id') id : string, @Body() team : Team): Promise<any> {
        return this.teamsService.update(id, team);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/:id')
    async delete(@Param('id') id : string ): Promise<any> {
        return this.teamsService.delete(id);
    }
}
