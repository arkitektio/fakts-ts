import { useEffect } from "react";
import { FaktsEndpoint, useFakts } from "./FaktsContext";
import { introspectUrl } from "./FaktsProvider";

export const WellKnownDiscovery = (props: {
  endpoints: string[];
  timeout?: number;
}) => {
  const { setRegisteredEndpoints } = useFakts();

  let introspectAll = async () => {
    let endpoints: FaktsEndpoint[] = [];

    for (let endpoint of props.endpoints) {
      try {
        let introspected = await introspectUrl(endpoint, props.timeout || 2000);
        endpoints.push(introspected);
      } catch (e) {
        console.error(e);
      }
    }
    return endpoints;
  };

  useEffect(() => {
    introspectAll().then((endpoints) => {
        setRegisteredEndpoints((oldendpoints) => [...oldendpoints, ...endpoints]);
    });
  }, [props.endpoints]);

  return <></>;
};
