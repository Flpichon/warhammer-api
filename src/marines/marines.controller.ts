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
import { MarinesService } from './marines.service';
import { CreateMarineDto } from './dto/create-marine.dto';
import { UpdateMarineDto } from './dto/update-marine.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { JwtPayload } from '../auth/auth.types';

@Controller('marines')
@UseGuards(JwtAuthGuard)
export class MarinesController {
  constructor(private readonly marinesService: MarinesService) {}

  @Post()
  create(@Body() dto: CreateMarineDto, @CurrentUser() user: JwtPayload) {
    return this.marinesService.create({
      ownerId: user.sub,
      name: dto.name,
      rank: dto.rank,
      stats: dto.stats,
      squadId: dto.squadId,
    });
  }
  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.marinesService.findAll({ ownerId: user.sub });
  }
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.marinesService.findById({ id, ownerId: user.sub });
  }
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateMarineDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.marinesService.update({
      ownerId: user.sub,
      id,
      name: dto.name,
      rank: dto.rank,
      squadId: dto.squadId,
      stats: dto.stats,
    });
  }
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.marinesService.remove({ ownerId: user.sub, id });
  }
}
