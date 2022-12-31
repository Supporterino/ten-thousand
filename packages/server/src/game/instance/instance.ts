import { ServerEvents } from '@app/../../shared/server/ServerEvents';
import { ServerPayloads } from '@app/../../shared/server/ServerPayloads';
import Lobby from '../lobby/lobby';
import { Socket } from 'socket.io';
import { RollOptions, RollState } from './rollState';

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

  public rollDice(options: RollOptions) {
    if (!this.currentRoll) this.currentRoll = new RollState();

    this.currentRoll.nextRoll(options);

    this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.DiceRoll]>(
      ServerEvents.DiceRoll,
      {
        firstRoll: this.currentRoll.rollCount === 0,
        lastDice: this.currentRoll.safedDice,
        newDice: this.currentRoll.activeDice,
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
