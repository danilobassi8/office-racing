import { useContext, useMemo } from 'react';
import { LeaderBoardChart } from '../components/charts/LeaderBoardChart';
import { ErrorMessage } from '../components/utils/ErrorMessage';
import { Loading } from '../components/utils/Loading';
import { Tabs } from '../components/tabs/Tabs';
import { Link } from 'react-router-dom';
import { PlayersDataContext } from '../context/PlayersData';
import { Tooltip } from 'react-tooltip';

function filterDataToRender(data: any[], maxMap: number, keysMustHave: string[]) {
  return data
    .filter((el: any) => keysMustHave.every((key) => el[key]))
    .map((el) => {
      return { ...el, sumOfTimes: keysMustHave.reduce((acc, current) => acc + el[current], 0) };
    });
}

export function LeaderBoard() {
  const { isLoading, errorGettingBestTimes, dataWithPlayers, refreshBestTimes, currentGlobalFecha } = useContext(
    PlayersDataContext
  );

  const render = () => {
    if (isLoading) return <Loading />;

    if (errorGettingBestTimes || !dataWithPlayers)
      return (
        <ErrorMessage errorMessage="Error obteniendo los mejores tiempos.">
          <button onClick={refreshBestTimes}>Reintentar</button>
        </ErrorMessage>
      );

    const keysMustHave = Array(currentGlobalFecha)
      .fill(undefined)
      .map((_, idx) => `Fecha${idx + 1}`);
    const dataToRender = filterDataToRender(dataWithPlayers, currentGlobalFecha, keysMustHave);

    return (
      <>
        <Tabs center={true}>
          <Link className="btn" to="./?tab=individual">
            Individual
          </Link>
          <Link
            onClick={(e) => e.preventDefault()}
            className="btn disabled"
            to="./?tab=grupal"
            data-tooltip-id="leaderboard-tooltip"
            data-tooltip-content="Próximamente"
          >
            Grupal
          </Link>
        </Tabs>
        <LeaderBoardChart data={dataToRender} sortKey="sumOfTimes" barKeys={keysMustHave} />
        <Tooltip id="leaderboard-tooltip" style={{ backgroundColor: 'var(--button-hover)' }} place="bottom" />
      </>
    );
  };

  return <>{render()}</>;
}
