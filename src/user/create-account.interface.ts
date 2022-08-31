import { Roles } from 'src/roles';

export interface CreateAccount {
  username: string;
  email: string;
  password: string;
  role?: Roles;
}
