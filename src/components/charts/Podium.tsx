import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList } from 'recharts';
import { millisecondsToTime } from '../../utils/utils';
import { useContext } from 'react';
import { GlobalContext } from '../../context/globalContext';

export function PodiumChart({ data }) {
  const { playersData } = useContext(GlobalContext);
  const getPlayerNameBySlackUser = (slack) => {
    const player = playersData.find((el) => el.slack == slack);
    return `${player.name} ${player.lastname}`;
  };

  return (
    <div className="chart podium-chart w-100 h-100">
      <ResponsiveContainer width="100%" height="95%">
        <BarChart data={data} layout="vertical" barCategoryGap={10}>
          <XAxis type="number" hide />
          <YAxis type="category" width={150} tickFormatter={(e) => getPlayerNameBySlackUser(data[e].player)} />
          <Bar dataKey="time" fill="#413ea0">
            <LabelList
              position="center"
              fill="yellow"
              valueAccessor={({ payload }) => millisecondsToTime(payload.time, true)}
            ></LabelList>
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
