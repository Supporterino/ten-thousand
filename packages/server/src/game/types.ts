import { ServerEvents } from '@shared/server/ServerEvents';
import { Socket } from 'socket.io';

export type AuthenticatedSocket = Socket & {
  data: {
    lobby: null;
  };

  emit: <T>(ev: ServerEvents, data: T) => boolean;
};
