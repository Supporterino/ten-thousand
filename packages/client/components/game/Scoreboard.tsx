import { Dialog, Modal, Table, Text } from '@mantine/core';
import { Ref, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { CurrentLobbyState } from './State';
import { JSONtoMap } from '@the-ten-thousand/shared/server/ParseFunctions';
import { Socket } from 'socket.io-client';
import useClientNames from '@hooks/useClientNames';

type ScoreboardProps = {
  open: boolean;
  close: () => void;
};

type ScoreEntry = {
  score: string;
  lastNumberScore: number;
  pastScores: Array<string>;
  roundsWithoutScore: number;
  playerID: Socket['id'];
};

const Scoreboard: React.FunctionComponent<ScoreboardProps> = ({
  open,
  close,
}: ScoreboardProps) => {
  const currentLobbyState = useRecoilValue(CurrentLobbyState);
  const [rows, setRows] = useState<Array<Array<string>>>();
  const [players, setPlayers] = useState<Array<string>>([]);
  const clientNames = useClientNames();

  useEffect(() => {
    if (!currentLobbyState) return;
    const scoreboard: Map<string, ScoreEntry> = JSONtoMap(
      currentLobbyState.scoreboard,
    );

    const newRows = new Map<number, Array<string>>();

    setPlayers([...scoreboard.keys()]);
    scoreboard.forEach((scoreEntry: ScoreEntry, clientId: string) => {
      scoreEntry.pastScores.forEach((score: string, index: number) => {
        let row;

        if (newRows.has(index)) row = newRows.get(index);
        else row = new Array<string>(players!.length);

        row![players!.indexOf(clientId)] = score;

        newRows.set(index, row!);
      });

      let finalRow;
      const finalIndex = scoreEntry.pastScores.length;
      if (newRows.has(finalIndex)) finalRow = newRows.get(finalIndex);
      else finalRow = new Array<string>(players!.length);

      finalRow![players!.indexOf(clientId)] = scoreEntry.score;

      newRows.set(finalIndex, finalRow!);
    });
    setRows([...newRows.values()]);

    console.log(newRows);
    console.log(players);
    console.log(rows);
  }, [currentLobbyState?.scoreboard]);

  return (
    <Modal
      opened={open}
      withCloseButton
      onClose={() => close()}
      radius="md"
      shadow={'sm'}
    >
      <Text>Scoreboard</Text>
      <Table>
        <thead>
          <tr>
            {players &&
              players.map((player) => (
                <th key={`header-${player}`}>
                  {clientNames?.get(player) ? clientNames?.get(player) : player}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {rows &&
            rows.map((entryArr, index) => (
              <tr key={`row-${index}`}>
                {entryArr.map((entry, innerIndex) => (
                  <td key={`row-${index}-data-${innerIndex}`}>{entry}</td>
                ))}
              </tr>
            ))}
        </tbody>
      </Table>
    </Modal>
  );
};

export default Scoreboard;
