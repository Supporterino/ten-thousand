import useClientNames from '@hooks/useClientNames';
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
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { Edit, ClipboardList } from 'tabler-icons-react';
import { CurrentLobbyState } from './State';

type GameHeaderProps = {
  openScoreboard: () => void;
};

const GameHeader: React.FunctionComponent<GameHeaderProps> = ({
  openScoreboard,
}: GameHeaderProps) => {
  const { socketManager } = useSocketManager();
  const currentLobbyState = useRecoilValue(CurrentLobbyState)!;
  const clientId = socketManager.getSocketId()!;
  const clientNames = useClientNames();

  const [opened, setOpened] = useState(false);
  const [newName, setNewName] = useState<string>();

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
        justify="flex-start"
        align="center"
        direction="row"
        wrap="nowrap"
        px={'sm'}
        w={'100%'}
      >
        <Text>
          {clientNames?.get(clientId) ? clientNames?.get(clientId) : clientId}
        </Text>
        <ActionIcon onClick={() => setOpened((o) => !o)} variant="filled">
          <Edit />
        </ActionIcon>
        <ActionIcon ml={'auto'} onClick={openScoreboard} variant="filled">
          <ClipboardList />
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
