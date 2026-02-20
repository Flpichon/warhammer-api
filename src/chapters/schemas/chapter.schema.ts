import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { applyBaseSchemaTransforms } from '../../common/mongoose/schema.transforms';

export type ChapterDocument = HydratedDocument<Chapter>;

@Schema({ timestamps: true })
export class Chapter {
  @Prop({ required: true, trim: true })
  declare name: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  declare ownerId: Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Chapter',
    required: false,
    default: null,
    index: true,
  })
  declare parentId: Types.ObjectId | null;

  // champs ajoutés par timestamps: true
  declare createdAt: Date;
  declare updatedAt: Date;

  // virtual Mongoose (string de _id)
  declare id: string;
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);
applyBaseSchemaTransforms(ChapterSchema);
ChapterSchema.index({ ownerId: 1, name: 1 }, { unique: true });
