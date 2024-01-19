/** Google sheets responses comes in rows. We need to map it like objects. First like of the array are the headers. */
export function mapResponseArrayToJson(array) {
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

export function matchInfoWithPlayers(json: any[], playerData: any[], key = 'slack') {
  return playerData?.map((player) => {
    const results = json.find((el) => el[key] == player[key]);
    return {
      ...player,
      ...results,
    };
  });
}

/** Given a user input (expected in MM:ss:mmm), it will return the number of milliseconds. */
export function timeInputToMilliseconds(userInput) {
  const [min, sec, ms] = userInput
    .toString()
    .split(/[.,:\s]/)
    .map((el) => parseInt(el));

  if ([min, sec, ms].some((n) => n == undefined) || sec >= 60 || ms >= 1000) {
    throw new Error('Bad format');
  }

  const result = min * 60 * 1000 + sec * 1000 + ms;

  if (isNaN(result)) {
    throw new Error('Result is not a number');
  }

  return result;
}

/** Function to convert ms to and object with minutes, seconds and ms or to a formatted string. */
export function millisecondsToTime(milliseconds, toString = false) {
  const minutes = Math.floor(milliseconds / (60 * 1000));
  const remainingMilliseconds = milliseconds % (60 * 1000);
  const seconds = Math.floor(remainingMilliseconds / 1000);
  const ms = remainingMilliseconds % 1000;

  if (toString) {
    const pad = (n: number, zeros) => `${n.toString().padStart(zeros, '0')}`;
    return `${pad(minutes, 2)}:${pad(seconds, 2)}:${pad(ms, 3)}`;
  }
  return {
    minutes,
    seconds,
    milliseconds: ms,
  };
}
