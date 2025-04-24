import { Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokensService } from '@use-cases/tokens/tokens.service';

@Global()
@Module({
  providers: [
    {
      provide: 'tokensService',
      useClass: TokensService,
    },
    JwtService,
  ],
  exports: ['tokensService'],
})
export class TokensModule {}
