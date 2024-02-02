import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList } from 'recharts';
import { millisecondsToTime } from '../../utils/utils';

export function LeaderBoardChart({ data, dataKey, userDataKey = 'slack' }) {
  const sortedData = data?.sort((a, b) => {
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
          <Bar dataKey={dataKey} fill="#413ea0">
            <LabelList
              position="center"
              fill="yellow"
              valueAccessor={({ payload }) => {
                const value = payload[dataKey];
                if (!value) return '';
                return millisecondsToTime(payload[dataKey], true);
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
