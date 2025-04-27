import { PracticeState } from '@common/utils/practice.state-machine';
import { PrismaService } from '@infrastructure/db/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { PracticeStatus } from '@prisma/client';

export class PracticeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly practiceState: PracticeState,
  ) {}

  async changeStatus(id: string, status: PracticeStatus) {
    const practice = await this.prisma.practice.findUnique({
      where: {
        id,
      },
    });

    if (!this.practiceState.canTransition(practice.status, status)) {
      throw new BadRequestException('');
    }

    return this.prisma.practice.update({
      where: { id },
      data: { status },
    });
  }
}
