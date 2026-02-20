import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { applyBaseSchemaTransforms } from '../../common/mongoose/schema.transforms';
export type MarineDocument = HydratedDocument<Marine>;
@Schema({ _id: false })
class MarineStats {
  @Prop({ required: true, min: 1 })
  declare hp: number;
  @Prop({ required: true, min: 0 })
  declare atk: number;
  @Prop({ required: true, min: 0 })
  declare def: number;
}
const MarineStatsSchema = SchemaFactory.createForClass(MarineStats);
applyBaseSchemaTransforms(MarineStatsSchema);
@Schema({ timestamps: true })
export class Marine {
  @Prop({ required: true, trim: true })
  declare name: string;
  @Prop({ required: true, trim: true })
  declare rank: string; // tu pourras en faire un enum côté DTO (MEMO @FLP)
  @Prop({ type: [String], default: [] })
  declare wargear: string[];
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Chapter',
    required: false,
    default: null,
    index: true,
  })
  declare chapterId: Types.ObjectId | null;
  @Prop({ type: MarineStatsSchema, required: true })
  declare stats: MarineStats;
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  declare ownerId: Types.ObjectId;
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Squad',
    required: false,
    index: true,
  })
  declare squadId?: Types.ObjectId;
}
export const MarineSchema = SchemaFactory.createForClass(Marine);
applyBaseSchemaTransforms(MarineSchema);
MarineSchema.index({ ownerId: 1, rank: 1 });
MarineSchema.index({ ownerId: 1, chapterId: 1, name: 1 }, { unique: true });
