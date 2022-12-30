import useSocketManager from '@hooks/useSocketManager';
import { Flex, Text } from '@mantine/core';
import { useRecoilValue } from 'recoil';
import { CurrentLobbyState } from './State';

const Game: React.FunctionComponent = () => {
  const { socketManager } = useSocketManager();
  const currentLobbyState = useRecoilValue(CurrentLobbyState)!;
  const clientId = socketManager.getSocketId()!;

  console.log(currentLobbyState);
  return (
    <Flex gap={'md'} justify="center" direction="column" wrap="wrap" w={'100%'}>
      <Text>My id: {clientId}</Text>
      <Text>Lobby ID: {currentLobbyState.lobbyId}</Text>
    </Flex>
  );
};

export default Game;
