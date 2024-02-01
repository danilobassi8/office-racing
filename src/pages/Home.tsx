import { PodiumChart } from '../components/charts/Podium';
import { Loading } from '../components/utils/Loading';
import { useGetBestTimes } from '../hooks/useFecha';
import { useEffect, useContext } from 'react';
import { GlobalContext } from '../context/globalContext';
import { matchInfoWithPlayers } from '../utils/utils';
import { Link, useSearchParams } from 'react-router-dom';
import { Tabs } from '../components/tabs/Tabs';
import { Tooltip } from 'react-tooltip';

export function Home() {
  const { data, isLoading, error, refresh } = useGetBestTimes();
  const { isGlobalContextLoading, globalData, playersData } = useContext(GlobalContext);
  const [searchParams] = useSearchParams();

  // call refresh when globalData is ready
  useEffect(() => {
    refresh();
  }, []);

  const renderContent = () => {
    if (isLoading || isGlobalContextLoading) {
      return <Loading style={{ height: '350px', marginTop: '25vh' }} />;
    }

    const dataWithPlayers = matchInfoWithPlayers(data, playersData);
    const currentGlobalFecha = globalData['FechaActual'];
    const maxFechas = parseInt(globalData['MaxFechas']);
    const searchParamFecha = parseInt(searchParams.get('fecha') || '1');

    if (error) {
      return (
        <HomeError errorMessage={error}>
          <button onClick={refresh}>Reintentar</button>
        </HomeError>
      );
    }

    if (isNaN(searchParamFecha)) {
      return (
        <HomeError errorMessage="La fecha introducida no es valida.">
          <Link to={`/home?fecha=${currentGlobalFecha}`}>
            <button>Ir a la Fecha actual</button>
          </Link>
        </HomeError>
      );
    }

    if (searchParamFecha > currentGlobalFecha) {
      return (
        <HomeError errorMessage="La fecha ingresada no está activa todavía.">
          <Link to={`/home?fecha=${currentGlobalFecha}`}>
            <button>Ir a la Fecha actual</button>
          </Link>
        </HomeError>
      );
    }

    return (
      <>
        <Tabs>
          {Array(maxFechas)
            .fill('')
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
                <Link to={`/home?fecha=${idx}`} key={idx}>
                  <button
                    disabled={disabled}
                    {...disabledTooltipProps}
                    className={idx === searchParamFecha ? 'focused' : ''}
                  >
                    Fecha {idx}
                  </button>
                </Link>
              );
            })}
        </Tabs>
        <PodiumChart data={dataWithPlayers} dataKey={`Fecha${searchParamFecha}`} />
        <Tooltip id="home-disabled-tooltip" style={{ backgroundColor: 'var(--button-hover)' }} />
      </>
    );
  };

  return <>{renderContent()}</>;
}

export function HomeError({ errorMessage, children = undefined }) {
  return (
    <div className="w-100 d-flex align-center flex-col">
      <h1>Error: </h1>
      <h4>{errorMessage}</h4>
      {children}
    </div>
  );
}
