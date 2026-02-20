import type { ChapterDocument } from './schemas/chapter.schema';
import type { ChapterPlain } from './chapters.types';

export function toChapterPlain(doc: ChapterDocument): ChapterPlain {
  return {
    id: doc.id,
    name: doc.name,
    ownerId: doc.ownerId.toHexString(),
    parentId: doc.parentId ? doc.parentId.toHexString() : null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}
