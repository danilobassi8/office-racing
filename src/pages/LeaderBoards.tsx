import { useContext } from 'react';
import { LeaderBoardChart } from '../components/charts/LeaderBoardChart';
import { ErrorMessage } from '../components/utils/ErrorMessage';
import { Loading } from '../components/utils/Loading';
import { Tabs } from '../components/tabs/Tabs';
import { Link, useSearchParams } from 'react-router-dom';
import { PlayersDataContext } from '../context/PlayersData';
import { Tooltip } from 'react-tooltip';
import { GlobalBoardChart } from '../components/charts/GrupalBoardChart';

/** Filter players that have all the keys */
function filterIndividualPlayerData(data: any[], keysMustHave: string[]) {
  return data
    .filter((el: any) => keysMustHave.every((key) => el[key]))
    .map((el) => {
      return { ...el, sumOfTimes: keysMustHave.reduce((acc, current) => acc + el[current], 0) };
    });
}

function filterGrupalDataToRender(data: any[], keysMustHave: string[], maxFecha = 1) {
  const KEY_TO_GROUP = 'car';

  const groupedDataByCar = data.reduce((acc, el) => {
    acc[el[KEY_TO_GROUP]] = acc[el[KEY_TO_GROUP]] || [];
    acc[el[KEY_TO_GROUP]].push(el);
    return acc;
  }, {});

  const results = [];
  const worstResults = {};
  let maxPlayersInATeam = 0;

  for (const [car, playersData] of Object.entries<any[]>(groupedDataByCar)) {
    if (playersData.length > maxPlayersInATeam) {
      maxPlayersInATeam = playersData.length;
    }

    for (const playerData of playersData) {
      for (const key of keysMustHave) {
        if (playerData[key]) {
          // if the player has data, check if it is the works result of its kind
          if (!worstResults[key]) {
            worstResults[key] = playerData[key];
          } else {
            if (worstResults[key] < playerData[key]) {
              worstResults[key] = playerData[key];
            }
          }
        } else {
          // in this case, this race will be filled with the worst result later.
        }
      }
    }

    const data = playersData.map((player) => {
      keysMustHave.map((key) => {
        if (!player[key]) {
          player[key + '_timeParsed'] = worstResults[key];
          player[key + '_fillMode'] = 'worst';
        } else {
          player[key + '_fillMode'] = 'result';
          player[key + '_timeParsed'] = player[key];
        }
      });
      return player;
    });

    results.push({ car, data });
  }

  return results;
}

export function LeaderBoard() {
  const { isLoading, errorGettingBestTimes, dataWithPlayers, refreshBestTimes, currentGlobalFecha } = useContext(
    PlayersDataContext
  );
  const [searchParams] = useSearchParams();
  const tab = (searchParams.get('tab') ?? '').toLowerCase();

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

    let chart = undefined;
    if (tab == 'individual' || tab == '') {
      const dataToRender = filterIndividualPlayerData(dataWithPlayers, keysMustHave);
      chart = <LeaderBoardChart data={dataToRender} sortKey="sumOfTimes" barKeys={keysMustHave} />;
    } else if (tab == 'grupal') {
      const dataToRender = filterGrupalDataToRender(dataWithPlayers, keysMustHave, currentGlobalFecha);
      chart = <GlobalBoardChart data={dataToRender} keysMustHave={keysMustHave} />;
    } else {
      return (
        <ErrorMessage errorMessage={`El tab "${tab}" es invalido`}>
          <span className="text-center">
            ¿De donde lo sacaste? <br />
            ¿Me estas queriendo tirar la página, o sos QA?
          </span>
        </ErrorMessage>
      );
    }

    return (
      <>
        <Tabs center={true}>
          <Link className={`btn ${tab === 'individual' || tab === '' ? 'focused' : ''}`} to="./?tab=individual">
            Individual
          </Link>
          <Link className={`btn ${tab === 'grupal' ? 'focused' : ''}`} to="./?tab=grupal">
            Grupal
          </Link>
        </Tabs>
        {chart}
        <Tooltip id="leaderboard-tooltip" style={{ backgroundColor: 'var(--button-hover)' }} place="bottom" />
      </>
    );
  };

  return <>{render()}</>;
}
