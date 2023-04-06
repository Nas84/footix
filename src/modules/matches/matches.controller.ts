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
import { MatchesService } from './matches.service';
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
import { CreateMatchDto, MatchDto, UpdateMatchDto } from './dto';

@Controller('api/matches')
@ApiTags('Matches')
@ApiBearerAuth()
export class MatchesController {
  constructor(private matchesService: MatchesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Finds all matches' })
  @ApiOkResponse({ description: 'Return all matches', type: [MatchDto] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'No match found' })
  async getAll(): Promise<MatchDto[]> {
    return this.matchesService.findAll();
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Finds a match by its id' })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Return a match', type: MatchDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Match not found' })
  async getById(@Param('id') id: string): Promise<MatchDto> {
    try {
      return await this.matchesService.findOneById(id);
    } catch (err) {
      throw new NotFoundException();
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new match' })
  @ApiBody({ type: [CreateMatchDto] })
  @ApiOkResponse({ description: 'The match has been successfully created.', type: MatchDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Match not found' })
  async create(@Body() match: CreateMatchDto): Promise<any> {
    return this.matchesService.create(match);
  }

  @Put('/:id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a match score' })
  @ApiParam({ name: 'id', type: String })
  @ApiNoContentResponse({ description: 'The match has been successfully updated.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Match not found' })
  @ApiBody({ type: [UpdateMatchDto] })
  async update(@Param('id') id: string, @Body() match: UpdateMatchDto): Promise<any> {
    const result = await this.matchesService.update(id, match);

    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }

  @Delete('/:id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a match' })
  @ApiParam({ name: 'id', type: String })
  @ApiNoContentResponse({ description: 'The maztch has been successfully deleted.' })
  @ApiNotFoundResponse({ description: 'Match not found' })
  async delete(@Param('id') id: string): Promise<any> {
    const result = await this.matchesService.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }
}
