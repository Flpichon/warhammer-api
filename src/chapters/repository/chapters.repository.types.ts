export type CreateChapterRepoParams = {
  ownerId: string;
  name: string;
  parentId?: string | null;
};

export type FindChaptersByOwnerParams = {
  ownerId: string;
  q?: string;
  parentId?: string | null;
};

export type FindChapterByIdAndOwnerParams = {
  id: string;
  ownerId: string;
};

export type UpdateChapterPatch = {
  name?: string;
  parentId?: string | null;
};

export type UpdateChapterByIdAndOwnerParams = {
  id: string;
  ownerId: string;
  update: UpdateChapterPatch;
};

export type RemoveChapterByIdAndOwnerParams = {
  id: string;
  ownerId: string;
};

export type CountByParentIdParams = {
  parentId: string;
  ownerId: string;
};
