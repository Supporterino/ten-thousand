import { v4 } from 'uuid';
import { Server, Socket } from 'socket.io';
import { AuthenticatedSocket } from '@app/game/types';
import { ServerEvents } from '@shared/server/ServerEvents';

class Lobby {
  public readonly id: string = v4();
  public readonly createdAt: Date = new Date();
  public readonly clients: Map<Socket['id'], AuthenticatedSocket> = new Map<
    Socket['id'],
    AuthenticatedSocket
  >();

  constructor(
    private readonly server: Server,
    public readonly numberOfClients: number,
  ) {}

  public addClient(client: AuthenticatedSocket): void {
    this.clients.set(client.id, client);
    client.join(this.id);
    client.data.lobby = this;
  }

  public removeClient(client: AuthenticatedSocket): void {
    this.clients.delete(client.id);
    client.leave(this.id);
    client.data.lobby = null;
  }

  public dispatchToLobby<T>(event: ServerEvents, payload: T): void {
    this.server.to(this.id).emit(event, payload);
  }
}

export default Lobby;
