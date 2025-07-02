import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';

@Injectable()
export class AgreementState {
  private transitions = {
    [Status.IN_PROGRESS]: [Status.DECLINED, Status.WAITING, Status.ACCEPTED ],
    [Status.WAITING]: [
      Status.ACCEPTED,
      Status.DECLINED,
    ],
    [Status.ACCEPTED]: [Status.DOCUMENTS_ACCEPTED, Status.DOCUMENTS_DECLINED],
    [Status.DOCUMENTS_ACCEPTED]: [Status.ACCEPTED],
    [Status.DOCUMENTS_DECLINED]: [Status.WAITING],
    [Status.DECLINED]: [Status.WAITING, Status.IN_PROGRESS],
  };

  canTransition(from: Status, to: Status): boolean {
    return this.transitions[from]?.includes(to) || false;
  }

  getPossibleTransitions(currentStatus: Status): Status[] {
    return this.transitions[currentStatus] || [];
  }
}
