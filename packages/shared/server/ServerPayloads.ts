import { ServerEvents } from './ServerEvents';

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
  };
};

export { ServerPayloads };
