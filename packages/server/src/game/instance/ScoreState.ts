import { Socket } from 'socket.io';

class ScoreState {
  public score: string;
  private lastNumberScore = 0;
  public pastScores: Array<string> = new Array<string>();
  private roundsWithoutScore = 0;

  constructor(public playerID: Socket['id']) {}

  increaseScore(value: number) {
    this.pastScores.push(this.score);
    this.lastNumberScore += value;
    this.score = `${this.lastNumberScore}`;
    this.roundsWithoutScore = 0;
  }

  noScore() {
    if (this.roundsWithoutScore === 2) {
      this.pastScores.push(this.score);
      this.lastNumberScore -= 350;
      this.score = `${this.lastNumberScore}`;
      this.roundsWithoutScore = 0;
    } else {
      this.pastScores.push(this.score);
      this.score = '-';
      this.roundsWithoutScore++;
    }
  }

  minusThousand() {
    this.pastScores.push(this.score);
    this.lastNumberScore -= 1000;
    this.score = `${this.lastNumberScore}`;
    this.roundsWithoutScore = 0;
  }
}

export default ScoreState;
