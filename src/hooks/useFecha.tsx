import { useFetch } from './useFetch';
import { mapResponseArrayToJson } from '../utils/utils';
import { SHEETS_URL } from '../services/globals';

function parseFechaResults(result) {
  const results = mapResponseArrayToJson(result);
  const summaryResult = {};

  results.forEach((result) => {
    const { time, user } = result;
    if (user in summaryResult) {
      // check if the result is better, otherwise, pass
      if (time < summaryResult[user].time) {
        summaryResult[user] = result;
      }
    } else {
      summaryResult[user] = result;
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
