import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context/globalContext';
import { useGetBestTimes } from './useFecha';
import { matchInfoWithPlayers } from '../utils/utils';

export function usePlayersBestTimes() {
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

  const dataWithPlayers = bestTimes && playersData ? matchInfoWithPlayers(bestTimes, playersData) : [];

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(isGlobalContextLoading || isBestTimesLoading);
  }, [isGlobalContextLoading, isBestTimesLoading]);

  return {
    isLoading,
    errorGettingBestTimes,
    refreshBestTimes,
    currentGlobalFecha: globalData?.FechaActual,
    maxFechas: globalData?.MaxFechas,
    dataWithPlayers,
  };
}
