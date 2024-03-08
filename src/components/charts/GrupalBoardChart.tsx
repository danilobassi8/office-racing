import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BAR_COLORS, PENALTY_COLOR } from '../../utils/colors';
import { ANIMATION_TOTAL_DURATION_MS } from '../../services/globals';
import { millisecondsToTime } from '../../utils/utils';

const CustomTooltip = ({ active, payload }, keysMustHave: any[], maxNumOfPlayer) => {
  if (!active) return <></>;

  const times = payload.at(0).payload.times.flat();
  const multiplier = payload.at(0).payload.playersCount;
  const showMultiplierText = multiplier !== maxNumOfPlayer;

  return (
    <div className="custom-tooltip">
      <div className="content">
        {keysMustHave.map((key) => {
          const keyTimes = times.filter((t) => t.key === key);
          const keyName = `Fecha ${key.split('Fecha').at(-1)}`;
          return (
            <>
              <span>{keyName}:</span>
              <ul key={key} style={{ margin: '0px' }}>
                {...keyTimes.map((time) => {
                  return (
                    <li
                      className="colored-bullet"
                      style={{ '--bullet-color': time.fillMode === 'penalty' ? PENALTY_COLOR : BAR_COLORS[3] } as any}
                    >
                      @{time.user} - {millisecondsToTime(time.time, true)}
                      {showMultiplierText && <span style={{ color: 'yellow' }}>&nbsp;&nbsp;*</span>}
                    </li>
                  );
                })}
              </ul>
            </>
          );
        })}

        {showMultiplierText && (
          <>
            <br />
            <span style={{ fontSize: 'small', color: 'yellow' }}>
              (*) Estos tiempos fueron multiplicados por {maxNumOfPlayer}
              {multiplier != 1 ? `/${multiplier}` : ''}.
            </span>
          </>
        )}
      </div>
    </div>
  );
};

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
            width={100}
            tickFormatter={(e) => {
              const record = sortedData[e];
              return record.car;
            }}
          />

          <Tooltip
            content={(a: any) => CustomTooltip(a, keysMustHave, maxNumOfPlayer)}
            cursor={{ fill: 'transparent' }}
            animationEasing="ease-out"
            animationDuration={ANIMATION_TOTAL_DURATION_MS}
          />

          {new Array(maxNumOfPlayer).fill(undefined).map((_, playerIdx) => {
            return (
              <Bar
                key={playerIdx}
                dataKey={(d) => {
                  const result = d.times[playerIdx];
                  const time = result
                    ? (result.reduce((acc, n) => acc + n.time, 0) * maxNumOfPlayer) / d.playersCount
                    : 0;
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
