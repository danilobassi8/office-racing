import { useContext, useMemo } from 'react';
import { LeaderBoardChart } from '../components/charts/LeaderBoardChart';
import { ErrorMessage } from '../components/utils/ErrorMessage';
import { Loading } from '../components/utils/Loading';
import { Tabs } from '../components/tabs/Tabs';
import { Link } from 'react-router-dom';
import { PlayersDataContext } from '../context/PlayersData';

export function LeaderBoard() {
  const { isLoading, errorGettingBestTimes, dataWithPlayers, refreshBestTimes } = useContext(PlayersDataContext);
  const dataGroupedByCar = useMemo(() => {
    if (!dataWithPlayers) return undefined;
    const map = dataWithPlayers.reduce((result, current) => {
      // Initialize the group for the current car if it doesn't exist
      result[current.car] = result[current.car] || [];
      result[current.car].push(current);
      return result;
    }, {});
    return Object.values(map);
  }, [dataWithPlayers]);

  const render = () => {
    if (isLoading) return <Loading />;

    if (errorGettingBestTimes || !dataWithPlayers)
      return (
        <ErrorMessage errorMessage="Error obteniendo los mejores tiempos.">
          <button onClick={refreshBestTimes}>Reintentar</button>
        </ErrorMessage>
      );

    console.log(dataWithPlayers);

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
