import { ServerEvents } from '@shared/server/ServerEvents';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { mapToJSON } from '@shared/server/ParseFunctions';
import Lobby from '../lobby/lobby';
import { Socket } from 'socket.io';
import { RollOptions, RollState } from './rollState';
import { Logger } from '@nestjs/common';
import ScoreState from './ScoreState';

class Instance {
  public hasStarted = false;
  public hasFinished = false;
  public scoreboard: Map<Socket['id'], ScoreState> = new Map<
    Socket['id'],
    ScoreState
  >();

  public activePlayer: Socket['id'];
  public currentRoll: RollState;
  public activeDice: Array<number>;
  public players: Array<Socket['id']>;

  private readonly logger: Logger = new Logger(Instance.name);

  constructor(private readonly lobby: Lobby) {}

  public triggerStart(): void {
    if (this.hasStarted) {
      return;
    }

    this.players = [...this.lobby.clients.keys()];
    this.activePlayer = this.players[0];

    this.lobby.clients.forEach((client) => {
      this.scoreboard.set(client.id, new ScoreState(client.id));
    });

    this.hasStarted = true;

    this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameNotification]>(
      ServerEvents.GameNotification,
      {
        color: 'blue',
        message: 'Game started !',
      },
    );
  }

  private nextRound() {
    const scoreState = this.scoreboard.get(this.activePlayer);

    if (!this.currentRoll.scoredThisRoll && this.currentRoll.rollCount === 1) {
      scoreState.minusThousand();
    }

    if (!this.currentRoll.scoredThisRoll && this.currentRoll.rollCount > 1) {
      scoreState.noScore();
    }

    if (this.currentRoll.scoredThisRoll) {
      scoreState.increaseScore(this.currentRoll.score);
    }

    this.logger.debug('Scorestate', JSON.stringify(scoreState));
    this.logger.debug('Scoreboard', mapToJSON(this.scoreboard));
    this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameNotification]>(
      ServerEvents.GameNotification,
      {
        color: 'blue',
        message: `Round ended. Score was ${
          this.currentRoll.scoredThisRoll ? this.currentRoll.score : '-'
        } which increased total score to ${scoreState.score}`,
      },
    );

    this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.NewRound]>(
      ServerEvents.NewRound,
      {},
    );

    this.activePlayer =
      this.players[
        (this.players.indexOf(this.activePlayer) + 1) % this.players.length
      ];

    this.logger.log(
      `Starting new round with active player: ${this.activePlayer}`,
    );

    this.currentRoll = undefined;
    this.lobby.dispatchLobbyState();
  }

  public rollDice(options: RollOptions) {
    if (!this.currentRoll) this.currentRoll = new RollState();
    this.currentRoll.scoredThisRoll = false;

    if (!this.currentRoll.nextRoll(options)) {
      this.nextRound();
      return;
    }

    this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.DiceRoll]>(
      ServerEvents.DiceRoll,
      {
        firstRoll: this.currentRoll.rollCount === 0,
        safedDice: this.currentRoll.safedDice,
        activeDice: this.currentRoll.activeDice,
        score: this.currentRoll.score,
      },
    );

    this.currentRoll.rollCount++;

    this.lobby.dispatchLobbyState();
  }

  public triggerFinish(): void {
    if (this.hasFinished || !this.hasStarted) {
      return;
    }

    this.hasFinished = true;

    this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameNotification]>(
      ServerEvents.GameNotification,
      {
        color: 'blue',
        message: 'Game finished !',
      },
    );
  }
}

export { Instance };
