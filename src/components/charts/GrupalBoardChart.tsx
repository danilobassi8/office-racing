import { Bar, BarChart, LabelList, Rectangle, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { BAR_COLORS } from '../../utils/colors';
import { ANIMATION_TOTAL_DURATION_MS } from '../../services/globals';

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

  const ANIMATION_DURATION_PER_BAR = ANIMATION_TOTAL_DURATION_MS / maxNumOfPlayer;

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

          {...new Array(maxNumOfPlayer).fill(undefined).map((_, playerIdx) => {
            let acc = 0;
            return (
              <Bar
                dataKey={(d) => {
                  const result = d.times[playerIdx];
                  const time = result
                    ? (result.reduce((acc, n) => acc + n.time, 0) * maxNumOfPlayer) / d.playersCount
                    : 0;
                  acc += time;
                  return time;
                }}
                fill={BAR_COLORS[playerIdx]}
                animationDuration={ANIMATION_DURATION_PER_BAR}
                animationBegin={ANIMATION_DURATION_PER_BAR * playerIdx}
                animationEasing="linear"
                stackId={''}
              >
                <LabelList
                  position="center"
                  fill="var(--text-main)"
                  className="hide-on-small"
                  valueAccessor={(payload) => {
                    const player = payload.times[playerIdx];
                    return player ? `@${player.at(0).user}` : null;
                  }}
                />
              </Bar>
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function CustomBarShape(props, id) {
  return <Rectangle {...props} className={id + props.width} />;
}
