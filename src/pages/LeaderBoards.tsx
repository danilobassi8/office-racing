import { useContext, useMemo } from 'react';
import { LeaderBoardChart } from '../components/charts/LeaderBoardChart';
import { ErrorMessage } from '../components/utils/ErrorMessage';
import { Loading } from '../components/utils/Loading';
import { Tabs } from '../components/tabs/Tabs';
import { Link } from 'react-router-dom';
import { PlayersDataContext } from '../context/PlayersData';

export function LeaderBoard() {
  const { isLoading, errorGettingBestTimes, dataWithPlayers, refreshBestTimes } = useContext(PlayersDataContext);
  const dataGroupedByCar = useMemo(
    () =>
      dataWithPlayers.reduce((result, current) => {
        const car = current.car;

        // Initialize the group for the current car if it doesn't exist
        result[car] = result[car] || [];
        result[car].push(current);
        return result;
      }, {}),
    [dataWithPlayers]
  );

  const render = () => {
    if (isLoading) return <Loading />;

    if (errorGettingBestTimes || !dataWithPlayers)
      return (
        <ErrorMessage errorMessage="Error obteniendo los mejores tiempos.">
          <button onClick={refreshBestTimes}>Reintentar</button>
        </ErrorMessage>
      );

    return (
      <>
        <Tabs center={true}>
          <Link className="btn" to="./?tab=individual">
            Individual
          </Link>
          <Link className="btn" to="./?tab=grupal">
            Grupal
          </Link>
        </Tabs>
        <LeaderBoardChart data={dataWithPlayers} dataKey={'Fecha1'} />
      </>
    );
  };

  return <>{render()}</>;
}
