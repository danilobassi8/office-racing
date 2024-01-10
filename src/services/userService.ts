import { FechaType, AnySheetsTabs } from '../types/types';

const SHEETS_URL =
  'https://script.google.com/macros/s/AKfycbzhCx7izLIJyRXVYKh6AwcnwtmcCNi9bj8JRChgJyQSFWU6gSV5xnOFB9wlS39Tfalx/exec';

/** Google sheets responses comes in rows. We need to map it like objects. First like of the array are the headers. */
function mapResponseArrayToJson(array) {
  const [headers, ...rows] = array;

  const results = [];

  for (const row of rows) {
    const res = {};
    headers.forEach((header, idx) => {
      res[header] = row[idx];
    });
    results.push(res);
  }
  return results;
}

export const userService = {
  /** Send a time to the sheet given a Date */
  sendTime: (fecha: FechaType, body: FormData) => {
    body.append('fecha', fecha);
    return fetch(SHEETS_URL, {
      method: 'POST',
      mode: 'no-cors',
      body,
    });
  },

  getTabData: (tab: AnySheetsTabs) => {
    return fetch(`${SHEETS_URL}?fn=readTab&tab=${tab}`)
      .then((response) => response.json())
      .then((array) => mapResponseArrayToJson(array));
  },
};
