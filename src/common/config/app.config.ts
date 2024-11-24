import { registerAs } from '@nestjs/config';

export interface IAppConfig {
  userSecret: string;
  userExpiresIn: string;
  port: number;
  databaseUrl: string;
  email: string;
  password: string;
}

export default registerAs(
  'app',
  (): IAppConfig => ({
    userSecret: process.env.JWT_USER_SECRET,
    userExpiresIn: process.env.JWT_USER_TOKEN_EXPIRES_IN,
    port: parseInt(process.env.PORT, 10) || 3000,
    databaseUrl: process.env.DATABASE_URL,
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
  }),
);
export interface IJwtPayload {
  id: number;
  email: string;
}
export enum SALT_ROUNDS {
  SALT_ROUNDS_VALUE = 10,
}
