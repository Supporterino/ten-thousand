import {
  Dice,
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
} from 'tabler-icons-react';

const getDice = (die: number) => {
  switch (die) {
    case 1:
      return <Dice1 size={42} />;
    case 2:
      return <Dice2 size={42} />;
    case 3:
      return <Dice3 size={42} />;
    case 4:
      return <Dice4 size={42} />;
    case 5:
      return <Dice5 size={42} />;
    case 6:
      return <Dice6 size={42} />;
    default:
      return <Dice size={42} />;
  }
};

export default getDice;
