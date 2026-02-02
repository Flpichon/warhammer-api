import type { UserDocument } from './schemas/user.schema';
import type { UserAuth, UserResponse } from './users.types';
export function toUserResponse(doc: UserDocument): UserResponse {
  return {
    id: doc.id,
    email: doc.email,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}
export function toUserAuth(doc: UserDocument): UserAuth {
  return {
    id: doc.id,
    email: doc.email,
    passwordHash: doc.passwordHash,
  };
}
