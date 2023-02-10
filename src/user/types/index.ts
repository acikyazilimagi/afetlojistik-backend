import { User } from '../schemas/user.schema';

export type LoginResponse = {
  user: Partial<User>;
  token: string;
};
