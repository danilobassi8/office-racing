import { useState, useCallback } from 'react';

export const useFetch = ({ url, extra = {}, parseResultsFn = undefined }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const httpCall = useCallback(
    async (args = {}) => {
      setIsLoading(true);
      try {
        const response = await fetch(url, { ...extra, ...args });
        if (!response.ok) throw new Error(response.statusText);
        const json = await response.json();
        setIsLoading(false);

        // we could want to parse results before setting the data
        const result = parseResultsFn ? parseResultsFn(json) : json;
        setData(result);
        setError(null);
        return result;
      } catch (error) {
        setError(`${error} Could not Fetch Data `);
        console.error(error);
        setIsLoading(false);
      }
    },
    [url, extra, parseResultsFn]
  );

  return { data, isLoading, error, httpCall };
};
