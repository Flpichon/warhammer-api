import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { applyBaseSchemaTransforms } from '../../common/mongoose/schema.transforms';
export type SquadDocument = HydratedDocument<Squad>; // Mongoose Document type (MEMO @FLP)
@Schema({ timestamps: true }) // updated at and created at (MEMO @FLP)
export class Squad {
  @Prop({ required: true, trim: true })
  declare name: string;
  @Prop({ required: true, trim: true })
  declare chapter: string;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  declare ownerId: Types.ObjectId;
  @Prop({ type: [Types.ObjectId], ref: 'Marine', default: [] })
  declare marineIds: Types.ObjectId[];
}
export const SquadSchema = SchemaFactory.createForClass(Squad);
applyBaseSchemaTransforms(SquadSchema);
SquadSchema.index({ ownerId: 1, name: 1 });
