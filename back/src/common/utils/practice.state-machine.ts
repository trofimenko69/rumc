import { Injectable } from '@nestjs/common';
import { PracticeStatus } from '@prisma/client';

@Injectable()
export class PracticeState {
  private transitions = {
    [PracticeStatus.DRAFT]: [PracticeStatus.PENDING, PracticeStatus.ARCHIVED],
    [PracticeStatus.PENDING]: [
      PracticeStatus.APPROVED,
      PracticeStatus.REJECTED,
    ],
    [PracticeStatus.APPROVED]: [PracticeStatus.ACTIVE, PracticeStatus.ARCHIVED],
    [PracticeStatus.ACTIVE]: [PracticeStatus.COMPLETED],
    [PracticeStatus.COMPLETED]: [PracticeStatus.ARCHIVED],
    [PracticeStatus.REJECTED]: [PracticeStatus.DRAFT, PracticeStatus.ARCHIVED],
  };

  canTransition(from: PracticeStatus, to: PracticeStatus): boolean {
    return this.transitions[from]?.includes(to) || false;
  }

  getPossibleTransitions(currentStatus: PracticeStatus): PracticeStatus[] {
    return this.transitions[currentStatus] || [];
  }
}
