import { PodiumChart } from '../components/charts/Podium';
import { Loading } from '../components/utils/Loading';
import { useGetFecha } from '../hooks/useFecha';
import { useEffect } from 'react';

export function Home() {
  const { data, isLoading, error, httpCall: refreshData } = useGetFecha(1);

  // call refresh on start
  useEffect(() => {
    console.log('useEffect');
    refreshData();
  }, []);

  return (
    <>
      {isLoading && <Loading style={{ height: '350px', marginTop: '25vh' }} />}
      {isLoading == false && !error && <PodiumChart data={data} />}
      {isLoading == false && error && (
        <div className="w-100 d-flex align-center flex-col">
          <h1>Error: </h1>
          <h4>Sintax error -..,asdas {error}</h4>
          <button onClick={refreshData}>Retry</button>
        </div>
      )}
    </>
  );
}
