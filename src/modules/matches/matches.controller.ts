import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { Match } from './match.entity';
import { MatchesService } from './matches.service';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@ApiTags('Matches')
@Controller('api/matches')
export class MatchesController {

    constructor(private matchesService: MatchesService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAll(): Promise<Match[]> {
        return this.matchesService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @ApiParam({ name: 'id', type: String })
    @Get('/:id')
    async getById(@Param('id') id : string): Promise<Match> {
        return this.matchesService.findOneById(id);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBody({ type: [Match] })
    @Post()
    async create(@Body() match: Match): Promise<any> {
        return this.matchesService.create(match);
    }

    @UseGuards(JwtAuthGuard)
    @ApiParam({ name: 'id', type: String })
    @ApiBody({ type: [Match] })
    @Put('/:id')
    async update(@Param('id') id : string, @Body() match : Match): Promise<any> {
        return this.matchesService.update(id, match);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/:id')
    async delete(@Param('id') id : string ): Promise<any> {
        return this.matchesService.delete(id);
    }
}
