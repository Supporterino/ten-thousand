import useSocketManager from '@hooks/useSocketManager';
import { Button, Flex, Slider, Highlight, Title, List } from '@mantine/core';
import { ClientEvents } from '@the-ten-thousand/shared/client/ClientEvents';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Dice1, Point } from 'tabler-icons-react';

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
    <Flex
      gap={'md'}
      pt={'lg'}
      justify="center"
      direction="column"
      wrap="wrap"
      w={'100%'}
    >
      <Title order={2} align="center">
        Ten Thousand
      </Title>
      <Highlight
        highlight={'ten thousand'}
        highlightStyles={(theme) => ({
          backgroundImage: theme.fn.linearGradient(
            45,
            theme.colors.cyan[5],
            theme.colors.indigo[5],
          ),
          fontWeight: 700,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        })}
      >
        Welcome to the game ten thousand. It is a simple dice game with the
        following rules.
      </Highlight>
      <List icon={<Point size={24} strokeWidth={2} color={'white'} />}>
        <List.Item>You can save your round score if it is above 350</List.Item>
        <List.Item>1s count as 100 and 5s as 50</List.Item>
        <List.Item>
          Pairs of three count as 100 * die. Double for each additional die
        </List.Item>
        <List.Item>
          A street counts as 2500 but needs to be confirmed with 350
        </List.Item>
        <List.Item>3 doubles count as 1000</List.Item>
      </List>
      <Title order={2} align="center">
        Create lobby
      </Title>
      <Title order={4}>Select number of players</Title>
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
        variant="outline"
        onClick={() => onCreateLobby('multi')}
      >
        Create Game
      </Button>
    </Flex>
  );
};

export default Introduction;
