import { PodiumChart } from '../components/charts/PodiumChart';
import { Loading } from '../components/utils/Loading';
import { Link, useSearchParams } from 'react-router-dom';
import { Tabs } from '../components/tabs/Tabs';
import { Tooltip } from 'react-tooltip';
import { ErrorMessage } from '../components/utils/ErrorMessage';
import { useContext } from 'react';
import { PlayersDataContext } from '../context/PlayersData';

export function Home() {
  const {
    dataWithPlayers,
    maxFechas,
    isLoading,
    errorGettingBestTimes,
    refreshBestTimes,
    currentGlobalFecha,
  } = useContext(PlayersDataContext);

  const [searchParams] = useSearchParams();
  const searchParamFecha = parseInt(searchParams.get('fecha') || (currentGlobalFecha ?? 1));

  const renderContent = () => {
    if (isLoading) {
      return <Loading />;
    }

    if (errorGettingBestTimes) {
      return (
        <ErrorMessage errorMessage="Error obteniendo los mejores tiempos.">
          <button onClick={refreshBestTimes}>Reintentar</button>
        </ErrorMessage>
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
        <Tooltip id="home-disabled-tooltip" style={{ backgroundColor: 'var(--button-hover)' }} place="bottom" />
      </>
    );

    if (searchParamFecha > currentGlobalFecha) {
      return (
        <>
          {TABS}
          <ErrorMessage errorMessage={`La Fecha ${searchParamFecha} no está activa todavía.`}>
            <Link to={`/home?fecha=${currentGlobalFecha}`} className="btn">
              Ir a la Fecha actual
            </Link>
          </ErrorMessage>
        </>
      );
    }
    if (isNaN(searchParamFecha)) {
      return (
        <>
          {TABS}
          <ErrorMessage errorMessage="La fecha introducida no es valida.">
            <Link to={`/home?fecha=${currentGlobalFecha}`} className="btn">
              Ir a la Fecha actual
            </Link>
          </ErrorMessage>
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
