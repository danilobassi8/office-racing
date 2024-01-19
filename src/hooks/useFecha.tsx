import { useFetch } from './useFetch';
import { mapResponseArrayToJson } from '../utils/utils';
import { SHEETS_URL } from '../services/globals';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context/globalContext';

function parseFechaResults(result) {
  const results = mapResponseArrayToJson(result);
  const summaryResult = {};

  results.forEach((result) => {
    const { time, player } = result;
    if (player in summaryResult) {
      // check if the result is better, otherwise, pass
      if (time < summaryResult[player].time) {
        summaryResult[player] = result;
      }
    } else {
      summaryResult[player] = result;
    }
  });
  return Object.entries(summaryResult).map(([_, obj]) => obj);
}

export function useGetFecha(number: number) {
  return useFetch({ url: `${SHEETS_URL}?fn=readTab&tab=Fecha${number}`, parseResultsFn: parseFechaResults });
}

export function useGetBestTimes(): {
  isLoading: boolean;
  data: any;
  error: any;
  refresh: (args?: any) => Promise<any>;
} {
  const { isPlayersLoading, playersData } = useContext(GlobalContext);
  const [loading, setLoading] = useState(true);

  const { data, isLoading: isBestTimesLoading, error, httpCall } = useFetch({
    url: `${SHEETS_URL}?fn=readTab&tab=Resultados`,
    parseResultsFn: mapResponseArrayToJson,
  });

  useEffect(() => {
    setLoading(isBestTimesLoading == true || isPlayersLoading == true || playersData.length == 0);
  }, [isBestTimesLoading, isPlayersLoading, playersData]);

  return {
    isLoading: loading,
    data,
    error,
    refresh: httpCall,
  };
}

export function usePostFechaResult() {
  return useFetch({
    url: `${SHEETS_URL}`,
    extra: {
      mode: 'no-cors',
      method: 'POST',
    },
  });
}
