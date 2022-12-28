import { Listener } from '@components/websocket/types';
import useSocketManager from '@hooks/useSocketManager';
import { showNotification } from '@mantine/notifications';
import { ServerEvents } from '@the-ten-thousand/shared/server/ServerEvents';
import { ServerPayloads } from '@the-ten-thousand/shared/server/ServerPayloads';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import Introduction from './Introduction';
import { CurrentLobbyState } from './State';

const GameManager: React.FunctionComponent = () => {
  const router = useRouter();
  const { socketManager } = useSocketManager();
  const [lobbyState, setLobbyState] = useRecoilState(CurrentLobbyState);

  //Init websocket
  useEffect(() => {
    socketManager.connect();

    const onGameNotification: Listener<
      ServerPayloads[ServerEvents.GameNotification]
    > = ({ color, message }) => {
      showNotification({
        message: message,
        color: color,
        autoClose: 2000,
      });
    };

    socketManager.registerListener(
      ServerEvents.GameNotification,
      onGameNotification,
    );

    return () => {
      socketManager.removeListener(
        ServerEvents.GameNotification,
        onGameNotification,
      );
    };
  }, []);

  if (lobbyState === null) return <Introduction />;

  return <></>;
};

export default GameManager;
