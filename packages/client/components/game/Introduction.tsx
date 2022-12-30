import useSocketManager from '@hooks/useSocketManager';
import { Button, Flex, Slider } from '@mantine/core';
import { ClientEvents } from '@the-ten-thousand/shared/client/ClientEvents';
import { ServerPayloads } from '@the-ten-thousand/shared/server/ServerPayloads';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Introduction: React.FunctionComponent = () => {
  const { socketManager } = useSocketManager();
  const router = useRouter();
  const [numberOfPlayers, setNumberOfPlayers] = useState<number>(2);

  useEffect(() => {
    if (router.query.lobby) {
      socketManager.emit({
        event: ClientEvents.LobbyJoin,
        data: {
          lobbyId: router.query.lobby,
        },
      });
    }
  }, [router, socketManager]);

  const onCreateLobby = (mode: 'solo' | 'multi') => {
    socketManager.emit({
      event: ClientEvents.LobbyCreate,
      data: {
        mode: mode,
        numberOfPlayers: numberOfPlayers,
      },
    });
  };

  return (
    <Flex gap={'md'} justify="center" direction="column" wrap="wrap" w={'100%'}>
      <Slider
        value={numberOfPlayers}
        onChange={setNumberOfPlayers}
        marks={[
          { value: 2, label: '2' },
          { value: 4, label: '4' },
          { value: 6, label: '6' },
        ]}
        min={2}
        max={6}
        step={1}
        size="md"
      />
      <Button
        mt={'md'}
        fullWidth
        variant="light"
        onClick={() => onCreateLobby('multi')}
      >
        Create Game
      </Button>
    </Flex>
  );
};

export default Introduction;
