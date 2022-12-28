import { ServerEvents } from '@shared/server/ServerEvents';
import { Socket } from 'socket.io';
import Lobby from './lobby/lobby';

export type AuthenticatedSocket = Socket & {
  data: {
    lobby: null | Lobby;
  };

  emit: <T>(ev: ServerEvents, data: T) => boolean;
};
