import useSocketManager from '@hooks/useSocketManager';
import { Button, Flex, Text } from '@mantine/core';
import { ClientEvents } from '@the-ten-thousand/shared/client/ClientEvents';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { Socket } from 'socket.io-client';
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
      <Text>My id: {clientId}</Text>
      <Text>Lobby ID: {currentLobbyState.lobbyId}</Text>
    </Flex>
  );
};

export default Game;
