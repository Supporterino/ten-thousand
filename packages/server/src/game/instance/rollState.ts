import { SocketExceptions } from '@shared/server/SocketExceptions';
import {
  isValidScoringSet,
  calculateScore,
} from '@shared/server/DiceSetValidation';
import { ServerException } from '../server.exception';

class RollState {
  public score: number;
  public safedDice?: Array<number>;
  public activeDice: Array<number>;
  public remainingDice: number;
  public rollCount: number;
  public scoredThisRoll: boolean;

  constructor() {
    this.rollCount = 0;
    this.remainingDice = 6;
    this.score = 0;
  }

  nextRoll({ toSafe, endRound }: RollOptions): boolean {
    if (toSafe) {
      this.calculateScore(toSafe);
      this.safedDice = this.safedDice ? this.safedDice.concat(toSafe) : toSafe;
      this.remainingDice = this.remainingDice - toSafe.length;
      if (this.remainingDice === 0) {
        this.remainingDice = 6;
        this.safedDice = undefined;
      }
      this.scoredThisRoll = true;
    }

    if (endRound) return false;

    this.activeDice = Array.from({ length: this.remainingDice }, () =>
      Math.ceil(Math.random() * 6),
    );

    return true;
  }

  private calculateScore(dices: Array<number>) {
    if (!dices.every((die) => this.activeDice.includes(die)))
      throw new ServerException(
        SocketExceptions.RollMismatch,
        'Dice to save not included in last dice roll',
      );

    if (!isValidScoringSet(dices))
      throw new ServerException(
        SocketExceptions.RollMismatch,
        `Dice to save aren' valid`,
      );

    this.score += calculateScore(dices);
  }
}

type RollOptions = {
  toSafe?: Array<number>;
  endRound: boolean;
};

export { RollState, RollOptions };
