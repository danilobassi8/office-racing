import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList, Rectangle } from 'recharts';
import { millisecondsToTime } from '../../utils/utils';
import { PENALTY_TIME_MS } from '../../services/globals';
import { BAR_COLORS, PENALTY_COLOR } from '../../utils/colors';

export function PodiumChart({ data, dataKey, userDataKey = 'slack' }) {
  const sortedData = data?.toSorted((a, b) => {
    const aValue = a[dataKey];
    const bValue = b[dataKey];

    if (!aValue) {
      return 1;
    }

    if (!bValue) {
      return -1;
    }

    return aValue - bValue;
  });

  const penaltyTime = Math.max(...sortedData.map((r) => (r[dataKey] ? r[dataKey] : -1))) + PENALTY_TIME_MS;

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
          <Bar dataKey={(r) => (r[dataKey] ? r[dataKey] : penaltyTime)} shape={(props) => CustomBar(props, props.payload[dataKey])}>
            <LabelList
              position="center"
              fill="yellow"
              valueAccessor={({ payload }) => {
                const value = payload[dataKey] ? payload[dataKey] : penaltyTime;
                return millisecondsToTime(value, true);
              }}
            />
            <LabelList
              position="insideLeft"
              fill="var(--text-main)"
              valueAccessor={(payload) => {
                return `${sortedData.findIndex((el) => el[userDataKey] == payload[userDataKey]) + 1}`;
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const CustomBar = (props, result) => {
  //use explicit fill here, or use the additional css class and make a css selector to update fill there
  const fillColor = result ? BAR_COLORS[0] : PENALTY_COLOR;
  return <Rectangle {...props} fill={fillColor} className="" />;
};
