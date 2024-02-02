import { createContext, useContext, useEffect, useState } from 'react';
import { useGetBestTimes } from '../hooks/useFecha';
import { GlobalContext } from './globalContext';
import { matchInfoWithPlayers } from '../utils/utils';

export const PlayersDataContext = createContext({
  isLoading: true,
  errorGettingBestTimes: false,
  refreshBestTimes: () => {},
  currentGlobalFecha: undefined,
  maxFechas: undefined,
  dataWithPlayers: undefined,
});

export function PlayersDataContextProvider({ children }) {
  const {
    data: bestTimes,
    isLoading: isBestTimesLoading,
    error: errorGettingBestTimes,
    refresh: refreshBestTimes,
  } = useGetBestTimes();
  const { isGlobalContextLoading, globalData, playersData } = useContext(GlobalContext);

  // call refresh when globalData is ready
  useEffect(() => {
    refreshBestTimes();
  }, []);

  const dataWithPlayers = bestTimes && playersData ? matchInfoWithPlayers(bestTimes, playersData) : undefined;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(isGlobalContextLoading || isBestTimesLoading);
  }, [isGlobalContextLoading, isBestTimesLoading]);

  return (
    <PlayersDataContext.Provider
      value={{
        isLoading,
        errorGettingBestTimes,
        refreshBestTimes,
        currentGlobalFecha: globalData?.FechaActual,
        maxFechas: globalData?.MaxFechas,
        dataWithPlayers,
      }}
    >
      {children}
    </PlayersDataContext.Provider>
  );
}
