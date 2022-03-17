import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(undefined);

  // stores data across re-render cycles
  const activateHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activateHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
        });
        const responseData = await response.json();

        // remove controller that has been finished in this current request
        activateHttpRequests.current = activateHttpRequests.current.filter(
          (req) => req !== httpAbortCtrl
        );

        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setIsLoading(false);
        return responseData;
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
        throw error;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    // this return function acts as a clean-up function before the next time useEffect runs again
    //    or when the component uses this hook unmounts
    // this is to handle when we fire a request but quickly switch to another page --> need to cancel the request
    return () => {
      activateHttpRequests.current.forEach((ac) => ac.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
