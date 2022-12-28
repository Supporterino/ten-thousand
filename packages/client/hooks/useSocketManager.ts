import { useContext } from 'react';
import { useRecoilValue } from 'recoil';

import { SocketManagerContext } from '@components/websocket/SocketManagerProvider';
import SocketState from '@components/websocket/SocketState';

export default function useSocketManager() {
  const socketManager = useContext(SocketManagerContext);
  const socket = useRecoilValue(SocketState);

  return { socketManager, socket };
}
