import { useFetch } from './useFetch';
import { mapResponseArrayToJson } from '../utils/sheetToObject';

const SHEETS_URL =
  'https://script.google.com/macros/s/AKfycbzhCx7izLIJyRXVYKh6AwcnwtmcCNi9bj8JRChgJyQSFWU6gSV5xnOFB9wlS39Tfalx/exec';

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

export function usePostFechaResult(number: number, body: FormData) {
  return useFetch({
    url: `${SHEETS_URL}?fn=readTab&tab=Fecha${number}`,
    extra: {
      body,
      mode: 'no-cors',
      method: 'POST',
    },
  });
}
