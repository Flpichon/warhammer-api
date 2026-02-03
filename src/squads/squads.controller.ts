import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateSquadDto } from './dto/create-squad.dto';
import { UpdateSquadDto } from './dto/update-squad.dto';
import { SquadsService } from './squads.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { JwtPayload } from '../auth/auth.types';

@Controller('squads')
@UseGuards(JwtAuthGuard)
export class SquadsController {
  constructor(private readonly squadsService: SquadsService) {}

  @Post()
  create(@Body() dto: CreateSquadDto, @CurrentUser() user: JwtPayload) {
    return this.squadsService.create({
      ownerId: user.sub,
      name: dto.name,
      chapter: dto.chapter,
    });
  }

  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.squadsService.findAll({ ownerId: user.sub });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.squadsService.findById({ ownerId: user.sub, id });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSquadDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.squadsService.update({
      ownerId: user.sub,
      id,
      name: dto.name,
      chapter: dto.chapter,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.squadsService.remove({ ownerId: user.sub, id });
  }

  @Post(':id/marines/:marineId')
  assignMarine(
    @Param('id') id: string,
    @Param('marineId') marineId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.squadsService.assignMarine({
      ownerId: user.sub,
      squadId: id,
      marineId,
    });
  }
}
