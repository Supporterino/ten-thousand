import GameManager from '@components/game/GameManager';
import Header from '@components/ui/Header';
import { Container } from '@mantine/core';
import { NextPage } from 'next';

const Page: NextPage = () => {
  return (
    <Container>
      <Header />
      <GameManager />
    </Container>
  );
};

export default Page;
