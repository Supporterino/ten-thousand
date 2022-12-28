import { UsePipes } from '@nestjs/common';
import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { ClientEvents } from '@shared/client/ClientEvents';
import { ServerEvents } from '@shared/server/ServerEvents';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { WsValidationPipe } from '../websockets/ws.validation-pipe';
import { AuthenticatedSocket } from './types';

@UsePipes(new WsValidationPipe())
@WebSocketGateway()
export class GameGateway implements OnGatewayConnection {
  handleConnection(client: any, ...args: any[]) {
    throw new Error('Method not implemented.');
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
