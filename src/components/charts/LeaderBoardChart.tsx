import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList, Rectangle } from 'recharts';
import { millisecondsToTime } from '../../utils/utils';
import { BAR_COLORS, PENALTY_COLOR } from '../../utils/colors';

const ANIMATION_TOTAL_DURATION_MS = 250;

export function LeaderBoardChart({ data, barKeys, userDataKey = 'slack' }) {
  const sortedData = data?.toSorted((a, b) => {
    const aValue = barKeys.reduce((acc, nextKey) => acc + a[nextKey + '_timeParsed'], 0);
    const bValue = barKeys.reduce((acc, nextKey) => acc + b[nextKey + '_timeParsed'], 0);

    return aValue - bValue;
  });

  const ANIMATION_DURATION_PER_BAR = ANIMATION_TOTAL_DURATION_MS / barKeys.length;

  return (
    <div className="chart podium-chart w-100 h-100">
      <ResponsiveContainer width="100%" height="95%">
        <BarChart data={sortedData} layout="vertical" barCategoryGap={10}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            width={150}
            tickFormatter={(e) => {
              const record = sortedData[e];
              return `${record.name} ${record.lastname}`;
            }}
          />

          {barKeys.map((key, idx) => {
            return (
              <Bar
                dataKey={key + '_timeParsed'}
                stackId={userDataKey}
                key={idx}
                animationDuration={ANIMATION_DURATION_PER_BAR}
                animationBegin={ANIMATION_DURATION_PER_BAR * idx}
                animationEasing="linear"
                shape={(props) => CustomBar(props, idx, key)}
              >
                <LabelList
                  position="center"
                  fill="var(--text-main)"
                  className="hide-on-small"
                  valueAccessor={({ payload }) => {
                    const value = payload[key + '_timeParsed'];
                    return millisecondsToTime(value, true);
                  }}
                />

                {idx === 0 && (
                  <LabelList
                    position="insideLeft"
                    fill="var(--text-main)"
                    valueAccessor={(payload) => {
                      return `${sortedData.findIndex((el) => el[userDataKey] == payload[userDataKey]) + 1}`;
                    }}
                  />
                )}
              </Bar>
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const CustomBar = (props, idx, keyToRender) => {
  //use explicit fill here, or use the additional css class and make a css selector to update fill there
  const wasPenalty = props.payload[keyToRender + '_fillMode'] == 'penalty';
  const fillColor = wasPenalty ? PENALTY_COLOR : BAR_COLORS[idx];

  return <Rectangle {...props} fill={fillColor} />;
};
