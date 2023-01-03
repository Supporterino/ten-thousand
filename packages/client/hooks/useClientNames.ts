import { CurrentLobbyState } from '@components/game/State';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { Socket } from 'socket.io-client';

const useClientNames = () => {
  const currentLobbyState = useRecoilValue(CurrentLobbyState);
  const [clientNames, setClientNames] = useState<Map<Socket['id'], string>>();

  useEffect(() => {
    if (currentLobbyState)
      setClientNames(new Map(currentLobbyState.clientNames));
  }, [currentLobbyState, currentLobbyState?.clientNames]);

  return clientNames;
};

export default useClientNames;
