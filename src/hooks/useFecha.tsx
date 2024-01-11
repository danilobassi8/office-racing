import { useFetch } from './useFetch';
import { mapResponseArrayToJson } from '../utils/utils';
import { SHEETS_URL } from '../services/globals';

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

export function usePostFechaResult() {
  return useFetch({
    url: `${SHEETS_URL}`,
    extra: {
      mode: 'no-cors',
      method: 'POST',
    },
  });
}
