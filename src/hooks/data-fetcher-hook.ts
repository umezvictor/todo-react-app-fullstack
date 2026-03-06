import { APICore } from "../api/apiCore";
import { useState, useEffect } from "react";

//useDataFetcher is a custom hook, it's meant to be used inside a React component, not inside an async thunk
export const useDataFetcher = (url: string) => {
  const api = new APICore();
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      console.log(url);
      const response = await api.getGeneric(url);
      console.log(response);
      setData(response.data); //my api returns data inside a value object, hence the 'response.data.value'
    })();
  }, [url]);

  return data;
};
