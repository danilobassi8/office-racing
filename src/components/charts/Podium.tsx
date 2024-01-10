import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

export function PodiumChart({ data }) {
  return (
    <div className="chart podium-chart w-100 h-100">
      <ResponsiveContainer width="90%" height="95%">
        <BarChart data={data} layout="vertical" barCategoryGap={10}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            width={150}
            tickFormatter={(e) => {
              return `${data[e].user}`;
            }}
          />
          <Bar dataKey="time" fill="#413ea0" label={{ position: 'center', fill: 'yellow', value: 'pepe' }}></Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
