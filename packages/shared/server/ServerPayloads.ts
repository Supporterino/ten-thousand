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
    clientNames: Array<[string, string]>;
    scoreboard: Array<[string, Array<string>]>;
    running: boolean;
    finished: boolean;
    activePlayer: Socket['id'];
  };

  [ServerEvents.DiceRoll]: {
    firstRoll: boolean;
    lastDice?: Array<number>;
    newDice: Array<number>;
  };
};

export { ServerPayloads };
