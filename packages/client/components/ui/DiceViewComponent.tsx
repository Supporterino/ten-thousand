import { Flex, Text, Button, Divider } from '@mantine/core';
import getDice from './DiceHelper';

type DiceViewProps = {
  name: string;
  dice: Array<number>;
  disabled?: boolean;
  onInteraction?: (arg0: number) => void;
  divider?: boolean;
};

const DiceView: React.FunctionComponent<DiceViewProps> = ({
  name,
  dice,
  disabled,
  onInteraction,
  divider,
}: DiceViewProps) => {
  return (
    <>
      <Text>{name}</Text>
      <Flex
        gap="md"
        justify="center"
        align="center"
        direction="row"
        wrap="wrap"
      >
        {dice.map((die: number, index: number) => (
          <Button
            disabled={disabled}
            p={0}
            onClick={() => {
              if (onInteraction) onInteraction(index);
            }}
            key={`diceview-${name}-${index}`}
          >
            {getDice(die)}
          </Button>
        ))}
      </Flex>
      {divider && <Divider my={'sm'} />}
    </>
  );
};

export default DiceView;
