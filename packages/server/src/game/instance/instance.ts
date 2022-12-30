import { ServerEvents } from '@app/../../shared/server/ServerEvents';
import { ServerPayloads } from '@app/../../shared/server/ServerPayloads';
import Lobby from '../lobby/lobby';

class Instance {
  public hasStarted = false;
  public hasFinished = false;

  constructor(private readonly lobby: Lobby) {}

  public triggerStart(): void {
    if (this.hasStarted) {
      return;
    }

    this.hasStarted = true;

    this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameNotification]>(
      ServerEvents.GameNotification,
      {
        color: 'blue',
        message: 'Game started !',
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
