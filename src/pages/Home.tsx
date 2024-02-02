import { PodiumChart } from '../components/charts/Podium';
import { Loading } from '../components/utils/Loading';
import { useGetBestTimes } from '../hooks/useFecha';
import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from '../context/globalContext';
import { matchInfoWithPlayers } from '../utils/utils';
import { Link, useSearchParams } from 'react-router-dom';
import { Tabs } from '../components/tabs/Tabs';
import { Tooltip } from 'react-tooltip';

function useHome() {
  const {
    data: bestTimes,
    isLoading: isBestTimesLoading,
    error: errorGettingBestTimes,
    refresh: refreshBestTimes,
  } = useGetBestTimes();
  const { isGlobalContextLoading, globalData, playersData } = useContext(GlobalContext);
  const [searchParams] = useSearchParams();

  // call refresh when globalData is ready
  useEffect(() => {
    refreshBestTimes();
  }, []);

  const dataWithPlayers = bestTimes && playersData ? matchInfoWithPlayers(bestTimes, playersData) : [];
  const searchParamFecha = parseInt(searchParams.get('fecha') || '1');

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(isGlobalContextLoading || isBestTimesLoading);
  }, [isGlobalContextLoading, isBestTimesLoading]);

  return {
    isLoading,
    searchParamFecha,
    errorGettingBestTimes,
    refreshBestTimes,
    currentGlobalFecha: globalData?.FechaActual,
    maxFechas: globalData?.MaxFechas,
    dataWithPlayers,
  };
}

export function Home() {
  const {
    dataWithPlayers,
    maxFechas,
    isLoading,
    searchParamFecha,
    errorGettingBestTimes,
    refreshBestTimes,
    currentGlobalFecha,
  } = useHome();

  const renderContent = () => {
    if (isLoading) {
      return <Loading style={{ height: '350px', marginTop: '25vh' }} />;
    }

    if (errorGettingBestTimes) {
      return (
        <HomeError errorMessage="Error obteniendo los mejores tiempos.">
          <button onClick={refreshBestTimes}>Reintentar</button>
        </HomeError>
      );
    }

    const TABS = (
      <>
        <Tabs>
          {Array(maxFechas)
            .fill(undefined)
            .map((_, i) => {
              const idx = i + 1;
              const disabled = idx > currentGlobalFecha;

              const disabledTooltipProps: any = disabled
                ? {
                    'data-tooltip-id': 'home-disabled-tooltip',
                    'data-tooltip-content': `La Fecha ${idx} todavía no está activa`,
                    'data-tooltip-place': 'bottom',
                  }
                : {};

              return (
                <Link
                  to={`/home?fecha=${idx}`}
                  key={idx}
                  className={`btn ${idx === searchParamFecha ? 'focused' : ''} ${disabled ? 'disabled' : ''}`}
                  {...disabledTooltipProps}
                  onClick={(event) => (disabled ? event.preventDefault() : null)}
                >
                  Fecha {idx}
                </Link>
              );
            })}
        </Tabs>
        <Tooltip id="home-disabled-tooltip" style={{ backgroundColor: 'var(--button-hover)' }} />
      </>
    );

    if (searchParamFecha > currentGlobalFecha) {
      return (
        <>
          {TABS}
          <HomeError errorMessage={`La Fecha ${searchParamFecha} no está activa todavía.`}>
            <Link to={`/home?fecha=${currentGlobalFecha}`} className="btn">
              Ir a la Fecha actual
            </Link>
          </HomeError>
        </>
      );
    }
    if (isNaN(searchParamFecha)) {
      return (
        <>
          {TABS}
          <HomeError errorMessage="La fecha introducida no es valida.">
            <Link to={`/home?fecha=${currentGlobalFecha}`} className="btn">
              Ir a la Fecha actual
            </Link>
          </HomeError>
        </>
      );
    }

    return (
      <>
        {TABS}
        <PodiumChart data={dataWithPlayers} dataKey={`Fecha${searchParamFecha}`} />
      </>
    );
  };

  return <>{renderContent()}</>;
}

export function HomeError({ errorMessage, children = undefined }) {
  return (
    <div className="w-100 d-flex align-center flex-col">
      <h1>Error: </h1>
      <h4 style={{ marginTop: '20px' }}>{errorMessage}</h4>
      {children}
    </div>
  );
}
