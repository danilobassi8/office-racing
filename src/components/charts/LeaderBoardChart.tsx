import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList } from 'recharts';
import { millisecondsToTime } from '../../utils/utils';
import { BAR_COLORS } from '../../utils/colors';

const ANIMATION_TOTAL_DURATION_MS = 250;

export function LeaderBoardChart({ data, sortKey, barKeys, userDataKey = 'slack' }) {
  const sortedData = data?.sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];

    if (!aValue) {
      return 1;
    }

    if (!bValue) {
      return -1;
    }

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
                dataKey={key}
                fill={BAR_COLORS[idx]}
                stackId={userDataKey}
                key={idx}
                animationDuration={ANIMATION_DURATION_PER_BAR}
                animationBegin={ANIMATION_DURATION_PER_BAR * idx}
                animationEasing="linear"
              >
                <LabelList
                  position="center"
                  fill="var(--text-main)"
                  valueAccessor={({ payload }) => {
                    const value = payload[key];
                    if (!value) return '';
                    return millisecondsToTime(payload[key], true);
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
