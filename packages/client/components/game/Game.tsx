import useSocketManager from '@hooks/useSocketManager';
import { Flex } from '@mantine/core';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import DiceField from './DiceField';
import GameHeader from './GameHeader';
import Scoreboard from './Scoreboard';
import { CurrentLobbyState } from './State';

const Game: React.FunctionComponent = () => {
  const { socketManager } = useSocketManager();
  const currentLobbyState = useRecoilValue(CurrentLobbyState)!;
  const clientId = socketManager.getSocketId()!;
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Scoreboard open={open} close={() => setOpen(false)} />
      <Flex
        gap={'md'}
        justify="center"
        direction="column"
        wrap="wrap"
        w={'100%'}
      >
        <GameHeader openScoreboard={() => setOpen(true)} />
        <DiceField />
      </Flex>
    </>
  );
};

export default Game;
