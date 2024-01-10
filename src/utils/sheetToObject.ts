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
