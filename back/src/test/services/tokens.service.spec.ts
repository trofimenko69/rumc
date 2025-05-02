import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokensService } from '@use-cases/tokens/tokens.service';
import { expect } from 'chai';
import * as sinon from 'sinon';

describe('TokensService', () => {
  let tokensService: TokensService;
  let configService: ConfigService;
  let jwtService: JwtService;

  const userId = '123';
  const accessToken = 'access-token';
  const refreshToken = 'refresh-token';
  const jwtSecret = 'secret-key';
  const accessTTL = '1h';
  const refreshTTL = '7d';

  beforeEach(() => {
    configService = new ConfigService();
    jwtService = new JwtService({} as any);

    sinon
      .stub(configService, 'getOrThrow')
      .withArgs(sinon.match.string.and(sinon.match('JWT_SECRET_KEY')))
      .returns(jwtSecret)
      .withArgs(sinon.match.string.and(sinon.match('JWT_ACCESS_TOKEN_TTL')))
      .returns(accessTTL)
      .withArgs(sinon.match.string.and(sinon.match('JWT_REFRESH_TOKEN_TTL')))
      .returns(refreshTTL);

    tokensService = new TokensService(jwtService, configService);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('generateTokens', () => {
    it('должен возвращать access и refresh токены', () => {
      const signStub = sinon.stub(jwtService, 'sign');
      signStub.onFirstCall().returns(accessToken);
      signStub.onSecondCall().returns(refreshToken);

      const result = tokensService.generateTokens(userId);

      expect(result).to.deep.equal({
        id: userId,
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      expect(signStub.calledTwice).to.be.true;
    });
  });

  describe('verifyTokens', () => {
    it('должен успешно верифицировать токен', async () => {
      const payload = { id: userId };
      sinon.stub(jwtService, 'verify').returns(payload as any);

      const result = await tokensService.verifyTokens('valid-token');
      expect(result).to.deep.equal(payload);
    });
  });

  describe('decodeTokens', () => {
    it('должен вернуть декодированный токен', async () => {
      const payload = { id: userId };
      sinon.stub(jwtService, 'decode').returns(payload as any);

      const result = await tokensService.decodeTokens('some-token');
      expect(result).to.deep.equal(payload);
    });
  });

  describe('refreshTokens', () => {
    it('должен вернуть новые access и refresh токены при валидном refresh токене', async () => {
      const oldToken = 'old-refresh-token';
      const newAccessToken = 'new-access';
      const newRefreshToken = 'new-refresh';

      sinon.stub(tokensService, 'verifyTokens').resolves({ id: userId } as any);
      const generateStub = sinon.stub(tokensService, 'generateTokens');
      generateStub.returns({
        id: userId,
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      });

      const result = await tokensService.refreshTokens(oldToken);

      expect(result).to.deep.equal({
        id: userId,
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      });
    });

    it('должен выбросить UnauthorizedException при невалидном токене', async () => {
      sinon
        .stub(tokensService, 'verifyTokens')
        .rejects(new Error('invalid token'));

      try {
        await tokensService.refreshTokens('bad-token');
        expect.fail('Ожидалось исключение');
      } catch (err) {
        expect(err).to.be.instanceOf(UnauthorizedException);
        expect(err.message).to.equal('Недействительный refresh token');
      }
    });
  });
});
