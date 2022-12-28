import { ServerEvents } from './ServerEvents';

type ServerPayloads = {
  [ServerEvents.Pong]: {
    message: string;
  };
};

export { ServerPayloads };
