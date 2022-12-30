import useSocketManager from '@hooks/useSocketManager';
import { ActionIcon, Flex, Text } from '@mantine/core';
import { ClientEvents } from '@the-ten-thousand/shared/client/ClientEvents';
import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { Socket } from 'socket.io-client';
import { Edit } from 'tabler-icons-react';
import { CurrentLobbyState } from './State';

const GameHeader: React.FunctionComponent = () => {
  const { socketManager } = useSocketManager();
  const currentLobbyState = useRecoilValue(CurrentLobbyState)!;
  const clientId = socketManager.getSocketId()!;

  const [clientNames, setClientNames] = useState<Map<Socket['id'], string>>();

  useEffect(() => {
    setClientNames(new Map(currentLobbyState.clientNames));
  }, [currentLobbyState.clientNames]);

  const setUserName = (name: string) => {
    socketManager.emit({
      event: ClientEvents.ChangeUsername,
      data: {
        lobbyId: currentLobbyState.lobbyId,
        name: name,
      },
    });
  };

  return (
    <Flex
      mih={50}
      bg="rgba(0, 0, 0, .3)"
      gap="md"
      justify="flex-end"
      align="center"
      direction="row"
      wrap="nowrap"
    >
      <Text>
        {clientNames?.get(clientId) ? clientNames?.get(clientId) : clientId}
      </Text>
      <ActionIcon onClick={() => setUserName('dummy')} variant="filled">
        <Edit />
      </ActionIcon>
    </Flex>
  );
};

export default GameHeader;
