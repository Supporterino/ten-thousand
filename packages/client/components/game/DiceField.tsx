import { Listener } from '@components/websocket/types';
import useSocketManager from '@hooks/useSocketManager';
import { Button, Flex, Group, Text } from '@mantine/core';
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
    socketManager.emit({
      event: ClientEvents.RollDice,
      data: {
        lobbyId: currentLobbyState.lobbyId,
        endRound: endRound,
        ...(toSafeDice.length > 0 && { toSafe: toSafeDice }),
      },
    });
    setToSafeDice([]);
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
    <Flex gap={'md'} justify="center" direction="column" wrap="wrap" w={'100%'}>
      {score && <Text>Round score: {score}</Text>}
      {safedDice && (
        <>
          <Text>Last Roll</Text>
          <Flex
            gap="md"
            justify="center"
            align="center"
            direction="row"
            wrap="wrap"
          >
            {safedDice.map((die: number, index: number) => (
              <Button disabled key={`safedDice-${index}`}>
                {die}
              </Button>
            ))}
          </Flex>
        </>
      )}
      {toSafeDice.length > 0 && (
        <>
          <Text>Dice to keep</Text>
          <Flex
            gap="md"
            justify="center"
            align="center"
            direction="row"
            wrap="wrap"
          >
            {toSafeDice.map((die: number, index: number) => (
              <Button
                disabled={globalDisable}
                key={`toSafeDice-${index}`}
                onClick={() => unsafeDie(index)}
              >
                {die}
              </Button>
            ))}
          </Flex>
        </>
      )}
      {rolledDice && <Text>Rolled Dice</Text>}
      <Flex
        gap="md"
        justify="center"
        align="center"
        direction="row"
        wrap="wrap"
      >
        {rolledDice?.map((die: number, index: number) => (
          <Button
            key={`rolledDice-${index}`}
            onClick={() => safeDie(index)}
            disabled={globalDisable}
          >
            {die}
          </Button>
        ))}
      </Flex>
      <Text>Estimated Score: {estimatedScore}</Text>
      <Group>
        <Button
          disabled={globalDisable || isNotValid}
          onClick={() => {
            roll(true);
          }}
        >
          End round
        </Button>
        <Button
          disabled={
            globalDisable ||
            isNotValid ||
            (toSafeDice.length === 0 && !firstRoll)
          }
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
