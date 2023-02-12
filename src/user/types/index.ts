import { User } from '../schemas/user.schema';

export type LoginResponse = {
  success: boolean;
};

export type ValidateVerificationCodeResponse = {
  user: Partial<User>;
  token: string;
};

export enum UserStatuses {
  PENDING = 100,
  VERIFIED = 200,
}
