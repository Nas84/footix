import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, NotFoundException } from '@nestjs/common';
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
    async getAll(): Promise<Team[]> {
        return this.teamsService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @ApiParam({ name: 'id', type: String })
    @Get(':id')
    async getById(@Param('id') id : string): Promise<Team> {
        try {
            return await this.teamsService.findOneById(id);
        }
        catch(err) {
            throw new NotFoundException();
        }
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
    @Put(':id')
    @HttpCode(204)
    async update(@Param('id') id : string, @Body() team : Team): Promise<any> {
        const result = await this.teamsService.update(id, team);

        if (result.affected === 0) {
            throw new NotFoundException();
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id : string ): Promise<any> {
        const result = await this.teamsService.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException();
        }
    }
}
