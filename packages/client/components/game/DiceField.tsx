import { Listener } from '@components/websocket/types';
import useSocketManager from '@hooks/useSocketManager';
import { Box, Button, Flex, Group, Text } from '@mantine/core';
import { ClientEvents } from '@the-ten-thousand/shared/client/ClientEvents';
import { ServerEvents } from '@the-ten-thousand/shared/server/ServerEvents';
import {
  isValidScoringSet,
  calculateScore,
} from '@the-ten-thousand/shared/server/DiceSetValidation';
import { ServerPayloads } from '@the-ten-thousand/shared/server/ServerPayloads';
import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { CurrentLobbyState } from './State';
import DiceView from '@components/ui/DiceViewComponent';
import { showNotification } from '@mantine/notifications';

const DiceField: React.FunctionComponent = () => {
  const { socketManager } = useSocketManager();
  const currentLobbyState = useRecoilValue(CurrentLobbyState)!;
  const clientId = socketManager.getSocketId()!;

  const [rolledDice, setRolledDice] = useState<Array<number>>();
  const [toSafeDice, setToSafeDice] = useState<Array<number>>([]);
  const [safedDice, setSafedDice] = useState<Array<number>>();
  const [score, setScore] = useState<number>();
  const [estimatedScore, setEstimatedScore] = useState<number>();
  const [firstRoll, setFirstRoll] = useState<boolean>(true);
  const [globalDisable, setGlobalDisable] = useState<boolean>(true);
  const [isNotValid, setIsNotValid] = useState<boolean>(false);

  const roll = (endRound: boolean = false) => {
    if (
      endRound &&
      safedDice &&
      toSafeDice.length > 0 &&
      (estimatedScore ? estimatedScore : 0) + (score ? score : 0) < 350
    ) {
      showNotification({
        message: `You don't reach the required score of 350`,
        color: 'orange',
        autoClose: 3000,
      });
    } else {
      socketManager.emit({
        event: ClientEvents.RollDice,
        data: {
          lobbyId: currentLobbyState.lobbyId,
          endRound: endRound,
          ...(toSafeDice.length > 0 && { toSafe: toSafeDice }),
        },
      });
      setToSafeDice([]);
    }
  };

  useEffect(() => {
    setGlobalDisable(currentLobbyState.activePlayer !== clientId);
  }, [clientId, currentLobbyState.activePlayer]);

  useEffect(() => {
    console.log(isValidScoringSet(toSafeDice));
    if (toSafeDice.length > 0) setIsNotValid(!isValidScoringSet(toSafeDice));
    else setIsNotValid(false);
  }, [toSafeDice]);

  useEffect(() => {
    if (!isNotValid) setEstimatedScore(calculateScore(toSafeDice));
  }, [isNotValid, toSafeDice]);

  useEffect(() => {
    const onDiceRoll: Listener<ServerPayloads[ServerEvents.DiceRoll]> = ({
      firstRoll,
      activeDice,
      safedDice,
      score,
    }) => {
      setRolledDice(activeDice);
      setSafedDice(safedDice);
      setScore(score);
      setFirstRoll(firstRoll);
    };

    const onRoundEnd: Listener<ServerPayloads[ServerEvents.NewRound]> = () => {
      setRolledDice(undefined);
      setToSafeDice([]);
      setSafedDice(undefined);
      setScore(undefined);
      setEstimatedScore(undefined);
      setFirstRoll(true);
      setGlobalDisable(true);
      setIsNotValid(false);
    };

    socketManager.registerListener(ServerEvents.DiceRoll, onDiceRoll);
    socketManager.registerListener(ServerEvents.NewRound, onRoundEnd);

    return () => {
      socketManager.removeListener(ServerEvents.DiceRoll, onDiceRoll);
      socketManager.removeListener(ServerEvents.NewRound, onRoundEnd);
    };
  }, []);

  const safeDie = (index: number) => {
    setToSafeDice((toSafeDice) => [...toSafeDice, rolledDice![index]]);
    const newArr = [...rolledDice!];
    newArr.splice(index, 1);
    setRolledDice(newArr);
  };

  const unsafeDie = (index: number) => {
    setRolledDice((rolledDice) => [...rolledDice!, toSafeDice[index]]);
    const newArr = [...toSafeDice];
    newArr.splice(index, 1);
    setToSafeDice(newArr);
  };

  return (
    <Flex
      gap={'md'}
      justify="center"
      direction="column"
      wrap="wrap"
      w={'100%'}
      sx={{ flexGrow: 1 }}
      pb={'lg'}
    >
      <Box sx={{ flexGrow: 1 }}>
        {score && <Text>Round score: {score}</Text>}
        {safedDice && (
          <DiceView name={'Last roll'} dice={safedDice} disabled divider />
        )}
        {toSafeDice.length > 0 && (
          <DiceView
            name={'Scoring dice'}
            dice={toSafeDice}
            disabled={globalDisable}
            onInteraction={unsafeDie}
            divider
          />
        )}
        {rolledDice && (
          <DiceView
            name={'Rolled dice'}
            dice={rolledDice}
            disabled={globalDisable}
            onInteraction={safeDie}
          />
        )}
      </Box>
      <Group>
        <Text>Estimated Score: {estimatedScore}</Text>
        {estimatedScore && score && (
          <Text ml={'auto'}>Final Score: {estimatedScore! + score!}</Text>
        )}
      </Group>
      <Group position="center">
        <Button
          w={'40%'}
          disabled={globalDisable || isNotValid || rolledDice?.length === 0}
          variant="outline"
          onClick={() => {
            roll(true);
          }}
        >
          End round
        </Button>
        <Button
          w={'40%'}
          disabled={
            globalDisable ||
            isNotValid ||
            (toSafeDice.length === 0 && !firstRoll)
          }
          variant="outline"
          onClick={() => {
            roll();
          }}
        >
          Roll
        </Button>
      </Group>
    </Flex>
  );
};

export default DiceField;
