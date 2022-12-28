import { Logger, UsePipes } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { ClientEvents } from '@shared/client/ClientEvents';
import { ServerEvents } from '@shared/server/ServerEvents';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { WsValidationPipe } from '@app/websockets/ws.validation-pipe';
import LobbyManager from '@app/game/lobby/lobby.manager';
import { AuthenticatedSocket } from '@app/game/types';
import { Server, Socket } from 'socket.io';

@UsePipes(new WsValidationPipe())
@WebSocketGateway()
export class GameGateway
  implements OnGatewayDisconnect, OnGatewayConnection, OnGatewayInit
{
  private readonly logger: Logger = new Logger(GameGateway.name);

  constructor(private readonly lobbyManager: LobbyManager) {}

  afterInit(server: Server) {
    this.lobbyManager.server = server;

    this.logger.log('Game server and gateway initialized.');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.lobbyManager.initializeSocket(client as AuthenticatedSocket);
  }

  handleDisconnect(client: Socket) {
    this.lobbyManager.terminateSocket(client as AuthenticatedSocket);
  }

  @SubscribeMessage(ClientEvents.Ping)
  onPing(
    client: AuthenticatedSocket,
  ): WsResponse<ServerPayloads[ServerEvents.Pong]> {
    return {
      event: ServerEvents.Pong,
      data: {
        message: 'pong',
      },
    };
  }
}
