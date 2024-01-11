import { PodiumChart } from '../components/charts/Podium';
import { Loading } from '../components/utils/Loading';
import { useGetFecha } from '../hooks/useFecha';
import { useEffect, useContext } from 'react';
import { GlobalContext } from '../context/globalContext';

const LOADING_STYLE = { height: '350px', marginTop: '25vh' };

export function Home() {
  const { globalData, isGlobalContextLoading } = useContext(GlobalContext);
  const { data, isLoading: isDataLoading, error, httpCall: refreshData } = useGetFecha(globalData?.FechaActual);

  // call refresh when globalData is ready
  useEffect(() => {
    if (globalData?.FechaActual) {
      refreshData();
    }
  }, [globalData]);

  const renderContent = () => {
    if (isGlobalContextLoading || isDataLoading) {
      return <Loading style={LOADING_STYLE} />;
    }

    if (error) {
      return (
        <div className="w-100 d-flex align-center flex-col">
          <h1>Error: </h1>
          <h4>{error}</h4>
          <button onClick={refreshData}>Retry</button>
        </div>
      );
    }

    return (
      <>
        <h2 className='text-center'>Resultados fecha {globalData?.FechaActual}</h2>
        <PodiumChart data={data} />
      </>
    );
  };

  return <>{renderContent()}</>;
}
