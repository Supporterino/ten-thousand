import { SocketExceptions } from '@app/../../shared/server/SocketExceptions';
import { ServerException } from '../server.exception';

class RollState {
  public score: number;
  public safedDice?: Array<number>;
  public activeDice: Array<number>;
  public remainingDice: number;
  public rollCount: number;

  constructor() {
    this.rollCount = 0;
    this.remainingDice = 6;
    this.score = 0;
  }

  nextRoll({ toSafe }: RollOptions) {
    if (toSafe) {
      this.calculateScore(toSafe);
    }

    this.activeDice = Array.from({ length: this.remainingDice }, () =>
      Math.ceil(Math.random() * 6),
    );
  }

  private calculateScore(dices: Array<number>) {
    if (!dices.every((die) => this.activeDice.includes(die)))
      throw new ServerException(
        SocketExceptions.RollMismatch,
        'Dice to save not included in last dice roll',
      );

    // TODO: Implement score calculation
  }
}

type RollOptions = {
  toSafe?: Array<number>;
};

export { RollState, RollOptions };
