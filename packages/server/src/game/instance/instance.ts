import { ServerEvents } from '@app/../../shared/server/ServerEvents';
import { ServerPayloads } from '@app/../../shared/server/ServerPayloads';
import Lobby from '../lobby/lobby';
import { Socket } from 'socket.io';
import { RollOptions, RollState } from './rollState';
import { Logger } from '@nestjs/common';

class Instance {
  public hasStarted = false;
  public hasFinished = false;
  public scoreboard: Map<Socket['id'], Array<string>> = new Map<
    Socket['id'],
    Array<string>
  >();

  public activePlayer: Socket['id'];
  public currentRoll: RollState;
  public activeDice: Array<number>;

  private readonly logger: Logger = new Logger(Instance.name);

  constructor(private readonly lobby: Lobby) {}

  public triggerStart(): void {
    if (this.hasStarted) {
      return;
    }

    this.hasStarted = true;

    this.lobby.clients.forEach((client) => {
      this.scoreboard.set(client.id, ['0']);
    });

    this.activePlayer = [...this.lobby.clients.keys()][0];

    this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameNotification]>(
      ServerEvents.GameNotification,
      {
        color: 'blue',
        message: 'Game started !',
      },
    );
  }

  private nextRound() {
    this.logger.log(
      `Starting new round with active player: ${this.activePlayer}`,
    );
  }

  public rollDice(options: RollOptions) {
    if (!this.currentRoll) this.currentRoll = new RollState();

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
