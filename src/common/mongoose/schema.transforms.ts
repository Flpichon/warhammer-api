import type { Schema } from 'mongoose';

type HexStringableId = { toHexString(): string };
type ApplyBaseSchemaTransformsOptions = {
  omit?: string[];
};
function hasToHexString(value: unknown): value is HexStringableId {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const rec = value as Record<string, unknown>;
  return typeof rec.toHexString === 'function';
}
function baseTransform(omit: string[] = []) {
  return (
    _doc: unknown,
    ret: { id?: string; _id?: unknown; __v?: unknown; [key: string]: unknown },
  ) => {
    if (ret._id != null) {
      if (typeof ret._id === 'string') {
        ret.id = ret._id;
      } else if (hasToHexString(ret._id)) {
        ret.id = ret._id.toHexString();
      } else {
        throw new Error('Unsupported _id type');
      }
      delete ret._id;
    }
    delete ret.__v;
    for (const key of omit) {
      delete ret[key];
    }
    return ret;
  };
}
export function applyBaseSchemaTransforms(
  schema: Schema,
  options: ApplyBaseSchemaTransformsOptions = {},
): void {
  const omit = options.omit ?? [];
  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: baseTransform(omit),
  });
  schema.set('toObject', {
    virtuals: true,
    versionKey: false,
    transform: baseTransform(omit),
  });
}
