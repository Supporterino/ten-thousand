import { Cron } from '@nestjs/schedule';
import { SocketExceptions } from '@shared/server/SocketExceptions';
import { Server } from 'socket.io';
import { LOBBY_LIFETIME } from '@app/game/constants';
import { ServerException } from '@app/game/server.exception';
import { AuthenticatedSocket } from '@app/game/types';
import Lobby from '@app/game/lobby/lobby';
import { LobbyMode } from '@app/game/lobby/types';

class LobbyManager {
  public server: Server;
  public readonly lobbies: Map<Lobby['id'], Lobby> = new Map<
    Lobby['id'],
    Lobby
  >();

  public initializeSocket(client: AuthenticatedSocket): void {
    client.data.lobby = null;
  }

  public terminateSocket(client: AuthenticatedSocket): void {
    client.data.lobby?.removeClient(client);
  }

  public createLobby(mode: LobbyMode, numberOfClients: number) {
    const clients: number = mode === 'solo' ? 1 : numberOfClients;

    const lobby = new Lobby(this.server, clients);

    this.lobbies.set(lobby.id, lobby);

    return lobby;
  }

  public joinLobby(lobbyId: string, client: AuthenticatedSocket) {
    const lobby = this.lobbies.get(lobbyId);

    if (!lobby)
      throw new ServerException(
        SocketExceptions.LobbyError,
        'Lobby not found!',
      );

    if (lobby.clients.size >= lobby.numberOfClients)
      throw new ServerException(
        SocketExceptions.LobbyError,
        'Lobby already full.',
      );

    lobby.addClient(client);
  }

  public getLobbyByID(lobbyId: string): Lobby {
    const lobby = this.lobbies.get(lobbyId);

    if (!lobby)
      throw new ServerException(
        SocketExceptions.LobbyError,
        'Lobby not found!',
      );

    return lobby;
  }

  @Cron('*/5 * * * *')
  private lobbiesCleaning(): void {
    for (const [lobbyId, lobby] of this.lobbies) {
      const now = new Date().getTime();
      const lobbyCreatedAt = lobby.createdAt.getTime();
      const lobbyLifetime = now - lobbyCreatedAt;

      if (lobbyLifetime > LOBBY_LIFETIME) {
        // TODO Add lobby termination

        this.lobbies.delete(lobby.id);
      }
    }
  }
}

export { LobbyManager };
