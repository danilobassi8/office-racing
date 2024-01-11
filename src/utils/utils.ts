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

/** Given a time in Minutes, seconds and ms, it will return the number of ms. */
export function timeToMilliseconds(minutes, seconds, milliseconds) {
  return minutes * 60 * 1000 + seconds * 1000 + milliseconds;
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
