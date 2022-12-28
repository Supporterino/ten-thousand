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
  };
};

export { ServerPayloads };
