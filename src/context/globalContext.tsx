import { createContext, useEffect, useState } from 'react';
import { SHEETS_URL } from '../services/globals';
import { useFetch } from '../hooks/useFetch';
import { mapResponseArrayToJson } from '../utils/utils';

export const GlobalContext = createContext({
  globalData: undefined,
  isGlobalContextLoading: true,
  playersData: [],
});

const mapAndSortByLastname = (response) => {
  const json = mapResponseArrayToJson(response);
  return json.sort((a, b) => a.lastname.localeCompare(b.lastname));
};

export function GlobalContextProvider({ children }) {
  const [isGlobalContextLoading, setIsGlobalContextLoading] = useState(true);

  const { data: globalData, isLoading: globalLoading, httpCall: loadGlobals } = useFetch({
    url: `${SHEETS_URL}?fn=readTab&tab=Globals`,
    parseResultsFn: (json) => mapResponseArrayToJson(json)[0],
  });

  const { data: playersData, isLoading: playerLoading, httpCall: loadPlayers } = useFetch({
    url: `${SHEETS_URL}?fn=readTab&tab=Participantes`,
    parseResultsFn: mapAndSortByLastname,
  });

  useEffect(() => {
    loadGlobals();
    loadPlayers();
  }, []);

  useEffect(() => {
    const isLoading = playerLoading == false && globalLoading == false;
    setIsGlobalContextLoading(isLoading);
  }, [playerLoading, globalLoading]);

  return (
    <GlobalContext.Provider value={{ globalData, playersData, isGlobalContextLoading }}>
      {children}
    </GlobalContext.Provider>
  );
}
