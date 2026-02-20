export type CreateChapterParams = {
  ownerId: string;
  name: string;
  parentId?: string | null;
};

export type FindChapterByIdParams = {
  ownerId: string;
  id: string;
};

export type FindChaptersParams = {
  ownerId: string;
  q?: string;
  parentId?: string;
};

export type UpdateChapterParams = {
  ownerId: string;
  id: string;
  name?: string;
  parentId?: string | null;
};

export type RemoveChapterParams = {
  ownerId: string;
  id: string;
};

export type ChapterPlain = {
  id: string;
  name: string;
  ownerId: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ChapterNode = ChapterPlain & {
  children: ChapterNode[];
};
