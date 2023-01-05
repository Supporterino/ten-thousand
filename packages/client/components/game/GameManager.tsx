import { Listener } from '@components/websocket/types';
import useSocketManager from '@hooks/useSocketManager';
import { showNotification } from '@mantine/notifications';
import { ServerEvents } from '@the-ten-thousand/shared/server/ServerEvents';
import { ServerPayloads } from '@the-ten-thousand/shared/server/ServerPayloads';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import Game from './Game';
import Introduction from './Introduction';
import { CurrentLobbyState } from './State';
import Waiting from './Waiting';

const GameManager: React.FunctionComponent = () => {
  const router = useRouter();
  const { socketManager } = useSocketManager();
  const [lobbyState, setLobbyState] = useRecoilState(CurrentLobbyState);

  //Init websocket
  useEffect(() => {
    socketManager.connect();

    const onLobbyState: Listener<
      ServerPayloads[ServerEvents.LobbyState]
    > = async (data) => {
      setLobbyState(data);
      console.log(lobbyState);

      router.query.lobby = data.lobbyId;

      await router.push(
        {
          pathname: '/',
          query: { ...router.query },
        },
        undefined,
        {},
      );
    };

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
    socketManager.registerListener(ServerEvents.LobbyState, onLobbyState);

    return () => {
      socketManager.removeListener(
        ServerEvents.GameNotification,
        onGameNotification,
      );
      socketManager.removeListener(ServerEvents.LobbyState, onLobbyState);
    };
  }, [router, setLobbyState, socketManager]);

  if (lobbyState === null) return <Introduction />;

  if (!lobbyState.running && !lobbyState.finished) return <Waiting />;

  return <Game />;
};

export default GameManager;
