import { useState, useCallback } from 'react';

export const useFetch = ({ url, extra = {}, parseResultsFn = undefined }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const httpCall = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(url, { ...extra });
      if (!response.ok) throw new Error(response.statusText);
      const json = await response.json();
      setIsLoading(false);

      // we could want to parse results before setting the data
      if (parseResultsFn) {
        setData(parseResultsFn(json));
      } else {
        setData(json);
      }
      setError(null);
      return json;
    } catch (error) {
      setError(`${error} Could not Fetch Data `);
      setIsLoading(false);
    }
  }, [url, extra, parseResultsFn]);

  return { data, isLoading, error, httpCall };
};
