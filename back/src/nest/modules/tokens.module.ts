import { TOKENS_SERVICE_SYMBOL } from '@common/constants';
import { Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokensService } from '@use-cases/tokens/tokens.service';

@Global()
@Module({
  providers: [
    {
      provide: TOKENS_SERVICE_SYMBOL,
      useClass: TokensService,
    },
    JwtService,
  ],
  exports: [TOKENS_SERVICE_SYMBOL],
})
export class TokensModule {}
