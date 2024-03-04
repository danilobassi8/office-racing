import { Bar, BarChart, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { BAR_COLORS } from '../../utils/colors';
import { millisecondsToTime } from '../../utils/utils';

function prepareDataToRender(data, keysMustHave) {
  const parsedData = data.map((record) => {
    const times = record.data.map((result) => {
      return keysMustHave.map((key) => {
        return {
          key,
          fillMode: result[`${key}_fillMode`],
          time: result[key] || result[key + '_timeParsed'],
          user: result.slack,
        };
      });
    });

    return {
      playersCount: record.data.length,
      car: record.car,
      times,
      timeCount: times.reduce((acc, next) => {
        const time = next.reduce((acc2, next2) => {
          return acc2 + next2.time;
        }, 0);
        return acc + time;
      }, 0),
    };
  });

  const maxNumOfPlayer = Math.max(...parsedData.map((r) => r.playersCount));
  const sortedData = parsedData
    .map((results) => {
      return { ...results, parsedTime: (results.timeCount * (maxNumOfPlayer / results.playersCount)).toFixed(2) };
    })
    .sort((a, b) => a.parsedTime - b.parsedTime);
  return { sortedData, maxNumOfPlayer };
}

export function GlobalBoardChart({ data, keysMustHave }) {
  const { sortedData, maxNumOfPlayer } = prepareDataToRender(data, keysMustHave);

  return (
    <div className="chart podium-chart">
      <ResponsiveContainer width="100%" height="95%">
        <BarChart data={sortedData} layout="vertical" barCategoryGap={10}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            width={150}
            tickFormatter={(e) => {
              const record = sortedData[e];
              return record.car;
            }}
          />
          <Bar dataKey={(d) => d.parsedTime} fill={BAR_COLORS[0]}>
            <LabelList
              position="insideLeft"
              fill="var(--text-main)"
              className="hide-on-small"
              valueAccessor={(payload) => {
                const m = (d) => millisecondsToTime(d, true);
                return `${m(payload.parsedTime)} - (${m(payload.timeCount)} * ${maxNumOfPlayer} / ${
                  payload.playersCount
                })`;
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
