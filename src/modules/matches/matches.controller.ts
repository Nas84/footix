import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, NotFoundException } from '@nestjs/common';
import { Match } from './match.entity';
import { MatchesService } from './matches.service';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Matches')
@Controller('api/matches')
export class MatchesController {

    constructor(private matchesService: MatchesService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAll(): Promise<Match[]> {
        return this.matchesService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @ApiParam({ name: 'id', type: String })
    @Get('/:id')
    async getById(@Param('id') id : string): Promise<Match> {
        try {
            return await this.matchesService.findOneById(id);
        }
        catch(err) {
            throw new NotFoundException();
        }
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
    @HttpCode(204)
    async update(@Param('id') id: string, @Body() match: Match): Promise<any> {
        const result = await this.matchesService.update(id, match);

        if (result.affected === 0) {
            throw new NotFoundException();
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/:id')
    @HttpCode(204)
    async delete(@Param('id') id: string): Promise<any> {
        const result = await this.matchesService.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException();
        }
    }
}
