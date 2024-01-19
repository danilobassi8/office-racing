import { PodiumChart } from '../components/charts/Podium';
import { Loading } from '../components/utils/Loading';
import { useGetBestTimes } from '../hooks/useFecha';
import { useEffect, useContext } from 'react';
import { GlobalContext } from '../context/globalContext';
import { matchInfoWithPlayers } from '../utils/utils';

const LOADING_STYLE = { height: '350px', marginTop: '25vh' };

export function Home() {
  const { data, isLoading, error, refresh } = useGetBestTimes();
  const { isGlobalContextLoading, globalData, playersData } = useContext(GlobalContext);

  // call refresh when globalData is ready
  useEffect(() => {
    refresh();
  }, []);

  const renderContent = () => {
    if (isLoading || isGlobalContextLoading) {
      return <Loading style={LOADING_STYLE} />;
    }

    if (error) {
      return (
        <div className="w-100 d-flex align-center flex-col">
          <h1>Error: </h1>
          <h4>{error}</h4>
          <button onClick={refresh}>Retry</button>
        </div>
      );
    }

    const dataWithPlayers = matchInfoWithPlayers(data, playersData);
    const currentFecha = globalData['FechaActual'];

    return (
      <>
        <h2 className="text-center">Resultados Fecha {currentFecha}</h2>
        <PodiumChart data={dataWithPlayers} dataKey={`Fecha${currentFecha}`} />
      </>
    );
  };

  return <>{renderContent()}</>;
}
