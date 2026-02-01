import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MarinesService } from './marines.service';
import { CreateMarineDto } from './dto/create-marine.dto';
import { UpdateMarineDto } from './dto/update-marine.dto';

@Controller('marines')
export class MarinesController {
  constructor(private readonly marinesService: MarinesService) {}

  @Post()
  create(
    @Body() dto: CreateMarineDto,
    @Headers('x-owner-id') ownerId?: string, // degueu pour l'instant mais on changera ça plus tard (MEMO @FLP)
  ) {
    if (!ownerId) {
      throw new BadRequestException('ownerId header is required');
    }
    return this.marinesService.create({
      ownerId,
      name: dto.name,
      rank: dto.rank,
      stats: dto.stats,
      squadId: dto.squadId,
    });
  }
  @Get()
  findAll(@Headers('x-owner-id') ownerId?: string) {
    if (!ownerId) {
      throw new BadRequestException('Missing x-owner-id header');
    }
    return this.marinesService.findAll({ ownerId });
  }
  @Get(':id')
  findOne(@Param('id') id: string, @Headers('x-owner-id') ownerId?: string) {
    if (!ownerId) {
      throw new BadRequestException('Missing x-owner-id header');
    }
    return this.marinesService.findById({ id, ownerId });
  }
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateMarineDto,
    @Headers('x-owner-id') ownerId?: string,
  ) {
    if (!ownerId) {
      throw new BadRequestException('Missing x-owner-id header');
    }

    return this.marinesService.update({
      ownerId,
      id,
      name: dto.name,
      rank: dto.rank,
      squadId: dto.squadId,
      stats: dto.stats,
    });
  }
  @Delete(':id')
  remove(@Param('id') id: string, @Headers('x-owner-id') ownerId?: string) {
    if (!ownerId) {
      throw new BadRequestException('Missing x-owner-id header');
    }
    return this.marinesService.remove({ ownerId, id });
  }
}
