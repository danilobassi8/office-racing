import { ComposedChart, LabelList, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Jugador A',
    value: 1400,
  },
  {
    name: 'Jugador B',
    value: 1506,
  },

  {
    name: 'Jugador C',
    value: 989,
  },
  {
    name: 'Jugador D',
    value: 1228,
  },
  {
    name: 'Jugador E',
    value: 1100,
  },
  {
    name: 'Jugador F',
    value: 1700,
  },
].sort((a, b) => a.value - b.value);

const renderLabel = (e) => 'asd';

export function Home() {
  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" barCategoryGap={10}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            width={150}
            tickFormatter={(e) => {
              return `${data[e].name}`;
            }}
          />

          <Bar dataKey="value" fill="#413ea0" label={{ position: 'insideLeft', fill: 'yellow', value: 'pepe' }}></Bar>
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
