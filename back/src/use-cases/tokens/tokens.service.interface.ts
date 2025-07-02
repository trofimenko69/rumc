import { User } from '@prisma/client';

export type TTokens = {
  id: User['id'];
  refresh_token: string;
  access_token: string;
};

export interface ITokensService {
  generateTokens(userId: User['id']): TTokens;
  verifyTokens(token: string): Promise<TTokens>;
  decodeTokens(token: string): Promise<TTokens>;
  refreshTokens(refreshToken: string): Promise<TTokens>;
}
