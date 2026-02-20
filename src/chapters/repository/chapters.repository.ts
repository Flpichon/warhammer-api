import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { DeleteResult, Model } from 'mongoose';

import { toObjectId } from '../../common/mongoose/objectid.utils';
import { Chapter, ChapterDocument } from '../schemas/chapter.schema';
import type {
  CountByParentIdParams,
  CreateChapterRepoParams,
  FindChapterByIdAndOwnerParams,
  FindChaptersByOwnerParams,
  RemoveChapterByIdAndOwnerParams,
  UpdateChapterByIdAndOwnerParams,
} from './chapters.repository.types';

@Injectable()
export class ChaptersRepository {
  constructor(
    @InjectModel(Chapter.name)
    private readonly chapterModel: Model<ChapterDocument>,
  ) {}

  create(params: CreateChapterRepoParams): Promise<ChapterDocument> {
    return this.chapterModel.create({
      ownerId: params.ownerId,
      name: params.name,
      parentId: params.parentId ?? null,
    });
  }

  findAllByOwner(params: FindChaptersByOwnerParams): Promise<ChapterDocument[]> {
    const filter: Record<string, unknown> = {
      ownerId: toObjectId(params.ownerId),
    };
    if (params.q) {
      filter.name = { $regex: params.q, $options: 'i' };
    }
    if (params.parentId !== undefined) {
      filter.parentId =
        params.parentId === null ? null : toObjectId(params.parentId);
    }
    return this.chapterModel.find(filter).sort({ name: 1 }).exec();
  }

  findAllRawByOwner(ownerId: string): Promise<ChapterDocument[]> {
    return this.chapterModel
      .find({ ownerId: toObjectId(ownerId) })
      .sort({ name: 1 })
      .exec();
  }

  findByIdAndOwner(
    params: FindChapterByIdAndOwnerParams,
  ): Promise<ChapterDocument | null> {
    return this.chapterModel
      .findOne({ _id: params.id, ownerId: params.ownerId })
      .exec();
  }

  updateByIdAndOwner(
    params: UpdateChapterByIdAndOwnerParams,
  ): Promise<ChapterDocument | null> {
    const $set: Record<string, unknown> = {};
    if (params.update.name !== undefined) {
      $set.name = params.update.name;
    }
    if (params.update.parentId !== undefined) {
      $set.parentId =
        params.update.parentId === null
          ? null
          : toObjectId(params.update.parentId);
    }
    return this.chapterModel
      .findOneAndUpdate(
        { _id: params.id, ownerId: params.ownerId },
        { $set },
        { new: true, runValidators: true },
      )
      .exec();
  }

  removeByIdAndOwner(
    params: RemoveChapterByIdAndOwnerParams,
  ): Promise<DeleteResult> {
    return this.chapterModel
      .deleteOne({ _id: params.id, ownerId: params.ownerId })
      .exec();
  }

  countChildrenByParentId(params: CountByParentIdParams): Promise<number> {
    return this.chapterModel
      .countDocuments({
        parentId: toObjectId(params.parentId),
        ownerId: toObjectId(params.ownerId),
      })
      .exec();
  }
}
