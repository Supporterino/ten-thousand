import { atom } from 'recoil';
import { ServerPayloads } from '@the-ten-thousand/shared/server/ServerPayloads';
import { ServerEvents } from '@the-ten-thousand/shared/server/ServerEvents';

export const CurrentLobbyState = atom<
  ServerPayloads[ServerEvents.LobbyState] | null
>({
  key: 'CurrentLobbyState',
  default: null,
});
