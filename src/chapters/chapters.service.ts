import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ChaptersRepository } from './repository/chapters.repository';
import { MarinesRepository } from '../marines/repository/marines.repository';
import { toChapterPlain } from './chapters.mapper';
import type {
  ChapterNode,
  ChapterPlain,
  CreateChapterParams,
  FindChapterByIdParams,
  FindChaptersParams,
  RemoveChapterParams,
  UpdateChapterParams,
} from './chapters.types';

@Injectable()
export class ChaptersService {
  constructor(
    private readonly chaptersRepository: ChaptersRepository,
    private readonly marinesRepository: MarinesRepository,
  ) {}

  async create(params: CreateChapterParams): Promise<ChapterPlain> {
    if (params.parentId) {
      const parent = await this.chaptersRepository.findByIdAndOwner({
        id: params.parentId,
        ownerId: params.ownerId,
      });
      if (!parent) {
        throw new NotFoundException('Parent chapter not found');
      }
    }

    try {
      const doc = await this.chaptersRepository.create({
        ownerId: params.ownerId,
        name: params.name.trim(),
        parentId: params.parentId ?? null,
      });
      return toChapterPlain(doc);
    } catch (err: any) {
      const code = (err as { code?: number })?.code;
      if (code === 11000) {
        throw new ConflictException('A chapter with this name already exists');
      }
      throw err;
    }
  }

  async findAll(params: FindChaptersParams): Promise<ChapterPlain[]> {
    const docs = await this.chaptersRepository.findAllByOwner({
      ownerId: params.ownerId,
      q: params.q?.trim() || undefined,
      parentId: params.parentId,
    });
    return docs.map(toChapterPlain);
  }

  async findTree(ownerId: string): Promise<ChapterNode[]> {
    const docs = await this.chaptersRepository.findAllRawByOwner(ownerId);
    return buildTree(docs.map(toChapterPlain));
  }

  async findById(params: FindChapterByIdParams): Promise<ChapterPlain | null> {
    const doc = await this.chaptersRepository.findByIdAndOwner({
      id: params.id,
      ownerId: params.ownerId,
    });
    return doc ? toChapterPlain(doc) : null;
  }

  async update(params: UpdateChapterParams): Promise<ChapterPlain | null> {
    const existing = await this.chaptersRepository.findByIdAndOwner({
      id: params.id,
      ownerId: params.ownerId,
    });
    if (!existing) {
      throw new NotFoundException('Chapter not found');
    }

    if (params.parentId !== undefined && params.parentId !== null) {
      if (params.parentId === params.id) {
        throw new ConflictException('A chapter cannot be its own parent');
      }
      const parent = await this.chaptersRepository.findByIdAndOwner({
        id: params.parentId,
        ownerId: params.ownerId,
      });
      if (!parent) {
        throw new NotFoundException('Parent chapter not found');
      }
    }

    try {
      const doc = await this.chaptersRepository.updateByIdAndOwner({
        id: params.id,
        ownerId: params.ownerId,
        update: {
          name: params.name,
          parentId: params.parentId,
        },
      });
      return doc ? toChapterPlain(doc) : null;
    } catch (err: any) {
      const code = (err as { code?: number })?.code;
      if (code === 11000) {
        throw new ConflictException('A chapter with this name already exists');
      }
      throw err;
    }
  }

  async remove(params: RemoveChapterParams): Promise<boolean> {
    const childCount = await this.chaptersRepository.countChildrenByParentId({
      parentId: params.id,
      ownerId: params.ownerId,
    });
    if (childCount > 0) {
      throw new ConflictException(
        'Cannot delete a chapter that has sub-chapters',
      );
    }

    const marineCount = await this.marinesRepository.countByChapterId({
      chapterId: params.id,
      ownerId: params.ownerId,
    });
    if (marineCount > 0) {
      throw new ConflictException(
        'Cannot delete a chapter that has marines assigned to it',
      );
    }

    const res = await this.chaptersRepository.removeByIdAndOwner({
      id: params.id,
      ownerId: params.ownerId,
    });
    return (res.deletedCount ?? 0) > 0;
  }
}

function buildTree(chapters: ChapterPlain[]): ChapterNode[] {
  const map = new Map<string, ChapterNode>();

  for (const c of chapters) {
    map.set(c.id, { ...c, children: [] });
  }

  const roots: ChapterNode[] = [];

  for (const node of map.values()) {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}
