import { v4 } from 'uuid';
import { Server, Socket } from 'socket.io';
import { AuthenticatedSocket } from '@app/game/types';
import { ServerEvents } from '@shared/server/ServerEvents';
import { Instance } from '@app/game/instance/instance';
import { ServerPayloads } from '@app/../../shared/server/ServerPayloads';

class Lobby {
  public readonly id: string = v4();
  public readonly createdAt: Date = new Date();
  public readonly clients: Map<Socket['id'], AuthenticatedSocket> = new Map<
    Socket['id'],
    AuthenticatedSocket
  >();
  public instance: Instance = new Instance(this);
  public clientNames: Map<Socket['id'], string> = new Map<
    Socket['id'],
    string
  >();

  constructor(
    private readonly server: Server,
    public readonly numberOfClients: number,
  ) {}

  public addClient(client: AuthenticatedSocket): void {
    this.clients.set(client.id, client);
    client.join(this.id);
    client.data.lobby = this;

    this.dispatchLobbyState();
  }

  public removeClient(client: AuthenticatedSocket): void {
    this.clients.delete(client.id);
    this.clientNames.delete(client.id);
    client.leave(this.id);
    client.data.lobby = null;

    this.dispatchLobbyState();
  }

  public changeName(client: AuthenticatedSocket, name: string): void {
    this.clientNames.set(client.id, name);

    this.dispatchLobbyState();
  }

  public dispatchLobbyState(): void {
    const payload: ServerPayloads[ServerEvents.LobbyState] = {
      lobbyId: this.id,
      mode: this.numberOfClients === 1 ? 'solo' : 'multi',
      numberOfPlayers: this.numberOfClients,
      clientNames: Array.from(this.clientNames),
    };

    this.dispatchToLobby(ServerEvents.LobbyState, payload);
  }

  public dispatchToLobby<T>(event: ServerEvents, payload: T): void {
    this.server.to(this.id).emit(event, payload);
  }
}

export default Lobby;
