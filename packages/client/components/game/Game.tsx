import useSocketManager from '@hooks/useSocketManager';
import { Flex } from '@mantine/core';
import { useRecoilValue } from 'recoil';
import DiceField from './DiceField';
import GameHeader from './GameHeader';
import { CurrentLobbyState } from './State';

const Game: React.FunctionComponent = () => {
  const { socketManager } = useSocketManager();
  const currentLobbyState = useRecoilValue(CurrentLobbyState)!;
  const clientId = socketManager.getSocketId()!;

  console.log(currentLobbyState);
  return (
    <Flex gap={'md'} justify="center" direction="column" wrap="wrap" w={'100%'}>
      <GameHeader />
      <DiceField />
    </Flex>
  );
};

export default Game;
