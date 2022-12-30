import useSocketManager from '@hooks/useSocketManager';
import {
  ActionIcon,
  Button,
  Dialog,
  Flex,
  Group,
  Text,
  TextInput,
} from '@mantine/core';
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
  const [opened, setOpened] = useState(false);
  const [newName, setNewName] = useState<string>();

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
    <>
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
        <ActionIcon onClick={() => setOpened((o) => !o)} variant="filled">
          <Edit />
        </ActionIcon>
      </Flex>
      <Dialog
        opened={opened}
        withCloseButton
        onClose={() => setOpened(false)}
        size="md"
        radius="md"
        position={{ top: 40, left: 20 }}
      >
        <Text size="sm" style={{ marginBottom: 10 }}>
          Set new username
        </Text>

        <Group align="flex-end">
          <TextInput
            placeholder="User1"
            value={newName}
            onChange={(e) => setNewName(e.currentTarget.value)}
            style={{ flex: 1 }}
          />
          <Button
            variant="filled"
            onClick={() => {
              setUserName(newName!);
              setOpened(false);
            }}
          >
            Submit
          </Button>
        </Group>
      </Dialog>
    </>
  );
};

export default GameHeader;
