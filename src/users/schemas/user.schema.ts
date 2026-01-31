import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { applyBaseSchemaTransforms } from '../../common/mongoose/schema.transforms';
export type UserDocument = HydratedDocument<User>; // Mongoose Document type (MEMO @FLP)
@Schema({ timestamps: true }) // updated at and created at (MEMO @FLP)
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  declare email: string;
  @Prop({ required: true })
  declare passwordHash: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
applyBaseSchemaTransforms(UserSchema, { omit: ['passwordHash'] });
UserSchema.index({ email: 1 }, { unique: true });
