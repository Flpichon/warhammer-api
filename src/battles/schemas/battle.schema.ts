import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { applyBaseSchemaTransforms } from '../../common/mongoose/schema.transforms';
export type BattleDocument = HydratedDocument<Battle>;
@Schema({ _id: false })
class BattleEnemy {
  @Prop({ required: true, trim: true })
  declare type: string;
  @Prop({ required: true, min: 1 })
  declare power: number;
}
const BattleEnemySchema = SchemaFactory.createForClass(BattleEnemy);
@Schema({ timestamps: true })
export class Battle {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  declare ownerId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Squad', required: true, index: true })
  declare squadId: Types.ObjectId;
  @Prop({ type: BattleEnemySchema, required: true })
  declare enemy: BattleEnemy;
  @Prop({ type: [String], default: [] })
  declare log: string[];
  @Prop({ required: true })
  declare result: string; // win|lose (on pourrait contraindre en DTO) (MEMO @FLP)
}
export const BattleSchema = SchemaFactory.createForClass(Battle);
applyBaseSchemaTransforms(BattleSchema);
BattleSchema.index({ ownerId: 1, createdAt: -1 });
