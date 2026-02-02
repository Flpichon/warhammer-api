import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { applyBaseSchemaTransforms } from '../../common/mongoose/schema.transforms';
export type UserDocument = HydratedDocument<User>; // Mongoose Document type (MEMO @FLP)
@Schema({ timestamps: true }) // updated at and created at (MEMO @FLP)
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  declare email: string;
  @Prop({ required: true, select: false }) // ne pas renvoyer par défaut (MEMO @FLP)
  declare passwordHash: string;
  // champs ajoutés par timestamps:true (pour typer) (MEMO @FLP)
  declare createdAt: Date;
  declare updatedAt: Date;
  // virtual Mongoose (string de _id) (MEMO @FLP)
  declare id: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
applyBaseSchemaTransforms(UserSchema, { omit: ['passwordHash'] });
