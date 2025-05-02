import { MinioService } from '@infrastructure/minio/minio.service';
import {
  BadGatewayException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthLoginDto, AuthRegisterDto } from '@presentation/dto/auth.dto';
import { AuthService } from '@use-cases/auth/auth.service';
import { ITokensService } from '@use-cases/tokens/tokens.service.interface';
import { IUserService } from '@use-cases/user/user.interface';
import * as bcrypt from 'bcrypt';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { anything, instance, mock, reset, verify, when } from 'ts-mockito';

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserService: IUserService;
  let mockTokensService: ITokensService;
  let mockConfigService: ConfigService;
  let mockMinioService: MinioService;

  const mockResponse = () => {
    const res: any = {};
    res.cookie = sinon.stub().returns(res);
    return res;
  };

  beforeEach(() => {
    mockUserService = mock<IUserService>();
    mockTokensService = mock<ITokensService>();
    mockConfigService = mock<ConfigService>();
    mockMinioService = mock<MinioService>();

    when(mockConfigService.getOrThrow('COOKIE_DOMAIN')).thenReturn('test.com');

    authService = new AuthService(
      instance(mockUserService),
      instance(mockTokensService),
      instance(mockConfigService),
      instance(mockMinioService),
    );
  });

  afterEach(() => {
    reset(mockUserService);
    reset(mockTokensService);
    reset(mockConfigService);
    reset(mockMinioService);
    sinon.restore();
  });

  describe('login', () => {
    it('должен выбросить NotFoundException, если пользователь не найден', async () => {
      const dto: AuthLoginDto = {
        email: 'test@test.com',
        password: 'password',
      };
      when(mockUserService.findByEmail(dto.email)).thenResolve(null);

      try {
        await authService.login(mockResponse(), dto);
        expect.fail('Должен выбросить ошибку NotFoundException');
      } catch (err) {
        expect(err).to.be.instanceOf(NotFoundException);
      }
    });

    it('должен выбросить NotFoundException, если пароль неверен', async () => {
      const dto: AuthLoginDto = { email: 'test@test.com', password: 'wrong' };
      const user = { id: '1', email: dto.email, password: 'hashed' };

      when(mockUserService.findByEmail(dto.email)).thenResolve(user as any);
      sinon.stub(bcrypt, 'compareSync').returns(false);

      try {
        await authService.login(mockResponse(), dto);
        expect.fail('Должен выбросить ошибку NotFoundException');
      } catch (err) {
        expect(err).to.be.instanceOf(NotFoundException);
      }
    });

    it('должен вернуть access token и установить cookie, если учетные данные верны', async () => {
      const dto: AuthLoginDto = {
        email: 'test@test.com',
        password: 'password',
      };
      const user = { id: '1', email: dto.email, password: 'hashed' };
      const tokens = {
        id: user.id,
        access_token: 'access',
        refresh_token: 'refresh',
      };
      const res = mockResponse();

      when(mockUserService.findByEmail(dto.email)).thenResolve(user as any);
      sinon.stub(bcrypt, 'compareSync').returns(true);
      when(mockTokensService.generateTokens(user.id)).thenReturn(tokens);

      const result = await authService.login(res, dto);

      expect(result).to.deep.equal({ access_token: tokens.access_token });
      sinon.assert.calledWith(
        res.cookie,
        'refreshToken',
        tokens.refresh_token,
        sinon.match({
          httpOnly: true,
          domain: 'test.com',
          secure: true,
          sameSite: 'strict',
        }),
      );
    });
  });

  describe('register', () => {
    it('должен выбросить BadGatewayException, если email уже существует', async () => {
      const dto: AuthRegisterDto = {
        email: 'test@test.com',
        password: 'password',
        fullName: 'Test User',
        type: 'INDIVIDUAL',
        role: 'STUDENT',
      };

      when(mockUserService.findByEmail(dto.email)).thenResolve({} as any);

      try {
        await authService.register(mockResponse(), dto);
        expect.fail('Должен выбросить ошибку BadGatewayException');
      } catch (err) {
        expect(err).to.be.instanceOf(BadGatewayException);
      }
    });

    it('должен создать пользователя, установить cookie и создать bucket при успешной регистрации', async () => {
      const dto: AuthRegisterDto = {
        email: 'test@test.com',
        password: 'password',
        fullName: 'Test User',
        type: 'INDIVIDUAL',
        role: 'STUDENT',
      };
      const user = { id: '1', ...dto };
      const tokens = {
        id: user.id,
        access_token: 'access',
        refresh_token: 'refresh',
      };
      const res = mockResponse();

      when(mockUserService.findByEmail(dto.email)).thenResolve(null);
      sinon.stub(bcrypt, 'hash').resolves('hashed');
      when(mockUserService.create(anything())).thenResolve(user as any);
      when(mockMinioService.createBucket(user.id)).thenResolve();
      when(mockTokensService.generateTokens(user.id)).thenReturn(tokens);

      const result = await authService.register(res, dto);

      expect(result).to.deep.equal({ access_token: tokens.access_token });
      sinon.assert.calledWith(
        res.cookie,
        'refreshToken',
        tokens.refresh_token,
        sinon.match({
          httpOnly: true,
          domain: 'test.com',
          secure: true,
          sameSite: 'strict',
        }),
      );
      verify(mockMinioService.createBucket(user.id)).once();
    });
  });

  describe('refreshToken', () => {
    it('должен выбросить UnauthorizedException, если refresh token отсутствует', async () => {
      const req = { cookies: {} };

      try {
        await authService.refreshToken(req as any, mockResponse());
        expect.fail('Должен выбросить ошибку UnauthorizedException');
      } catch (err) {
        expect(err).to.be.instanceOf(UnauthorizedException);
      }
    });

    it('должен выбросить UnauthorizedException, если refresh token недействителен', async () => {
      const req = { cookies: { refreshToken: 'invalid' } };

      when(mockTokensService.refreshTokens('invalid')).thenReject(
        new Error('Invalid token'),
      );

      try {
        await authService.refreshToken(req as any, mockResponse());
        expect.fail('Должен выбросить ошибку UnauthorizedException');
      } catch (err) {
        expect(err).to.be.instanceOf(UnauthorizedException);
      }
    });

    it('должен вернуть новые токены, если refresh token действителен', async () => {
      const req = { cookies: { refreshToken: 'valid' } };
      const res = mockResponse();
      const tokens = {
        access_token: 'new_access',
        refresh_token: 'new_refresh',
        id: '1',
      };

      when(mockTokensService.refreshTokens('valid')).thenResolve(tokens);
      when(mockTokensService.generateTokens('1')).thenReturn({
        id: '1',
        access_token: 'new_access',
        refresh_token: 'new_refresh',
      });

      const result = await authService.refreshToken(req as any, res);

      expect(result).to.deep.equal({ access_token: 'new_access' });
      sinon.assert.calledWith(
        res.cookie,
        'refreshToken',
        'new_refresh',
        sinon.match({
          httpOnly: true,
          domain: 'test.com',
          secure: true,
          sameSite: 'strict',
        }),
      );
    });
  });

  describe('logout', () => {
    it('должен удалить cookie с refresh token', async () => {
      const res = mockResponse();

      await authService.logout(res);

      sinon.assert.calledWith(
        res.cookie,
        'refreshToken',
        '',
        sinon.match({
          httpOnly: true,
          domain: 'test.com',
          expires: new Date(0),
          secure: true,
          sameSite: 'strict',
        }),
      );
    });
  });

  describe('recoverPassword', () => {
    it('должен удалить cookie с refresh token', async () => {
      await authService.recoverPassword('test@test.com');
    });
  });
});
