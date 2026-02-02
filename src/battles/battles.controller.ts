import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateBattleDto } from './dto/create-battle.dto';
import { BattlesService } from './battles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { JwtPayload } from '../auth/auth.types';

@Controller('battles')
@UseGuards(JwtAuthGuard)
export class BattlesController {
  constructor(private readonly battlesService: BattlesService) {}

  @Post()
  create(@Body() dto: CreateBattleDto, @CurrentUser() user: JwtPayload) {
    // Simple placeholder "combat" until the real simulation exists
    const result = dto.enemy.power <= 10 ? 'win' : 'lose';
    const log = [
      `Squad engages ${dto.enemy.type} (power=${dto.enemy.power}) -> ${result}`,
    ];

    return this.battlesService.create({
      ownerId: user.sub,
      squadId: dto.squadId,
      enemy: dto.enemy,
      log,
      result,
    });
  }

  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.battlesService.findAll({ ownerId: user.sub });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.battlesService.findById({ ownerId: user.sub, id });
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.battlesService.remove({ ownerId: user.sub, id });
  }
}
