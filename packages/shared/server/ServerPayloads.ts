import { ServerEvents } from './ServerEvents';
import { Socket } from 'socket.io';

type ServerPayloads = {
  [ServerEvents.Pong]: {
    message: string;
  };

  [ServerEvents.GameNotification]: {
    message: string;
    color: string;
  };

  [ServerEvents.LobbyState]: {
    lobbyId: string;
    mode: 'solo' | 'multi';
    numberOfPlayers: number;
    clientNames: Map<Socket['id'], string>;
  };
};

export { ServerPayloads };
