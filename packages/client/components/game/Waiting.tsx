import { Flex, Title, Text, Anchor, Group, Button } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import { ClipboardCheck, ClipboardCopy, Share } from 'tabler-icons-react';
import { CurrentLobbyState } from './State';

const Waiting: React.FunctionComponent = () => {
  const router = useRouter();
  const currentLobbyState = useRecoilValue(CurrentLobbyState)!;
  const url = `${process.env.NEXT_PUBLIC_URL}/?lobby=${router.query.lobby}`;
  const clipboard = useClipboard();

  const share = async () => {
    try {
      await navigator.share({
        url: url,
        title: 'Play ten thousand with me!',
      });
    } catch (error) {}
  };

  return (
    <Flex
      mih={50}
      gap="md"
      align="center"
      direction="column"
      wrap="wrap"
      pt="lg"
    >
      <Title order={1} align="center">
        Waiting lobby
      </Title>
      <Text>
        You created a lobby for {currentLobbyState.numberOfPlayers} players. The
        game starts once enough player have joined.
      </Text>
      <Title order={4} align="center">
        {currentLobbyState.onlinePlayers} / {currentLobbyState.numberOfPlayers}{' '}
        Player
      </Title>
      <Text>
        You can share the lobby with other by sending them the following link:
      </Text>
      <Anchor href={url} target="_blank">
        {url}
      </Anchor>
      <Group w={'100%'} position="center">
        <Button
          variant="outline"
          color={clipboard.copied ? 'teal' : 'blue'}
          onClick={() => clipboard.copy(url)}
          leftIcon={clipboard.copied ? <ClipboardCheck /> : <ClipboardCopy />}
          w={'40%'}
        >
          {clipboard.copied ? 'Copied' : 'Copy'}
        </Button>
        <Button
          variant="outline"
          color={'blue'}
          onClick={() => share()}
          leftIcon={<Share />}
          w={'40%'}
        >
          Share
        </Button>
      </Group>
    </Flex>
  );
};

export default Waiting;
