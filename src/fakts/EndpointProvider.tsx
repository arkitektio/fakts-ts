import React, { useContext, useEffect, useState } from "react";
import { FaktsEndpoint } from "./FaktsContext";

export type EndpointsContextType = {
  endpoints: FaktsEndpoint[];
  load: () => Promise<FaktsEndpoint[]>;
};

export const EndpointsContext = React.createContext<EndpointsContextType>({
  endpoints: [],
  load: () => Promise.resolve([]),
});

export const useEndpoints = () => useContext(EndpointsContext);

export const EndpointsProvider = ({
  children,
  staticEndpoints = [],
  loadEndpoints = async () => [],
  loadOnMount = true,
}: {
  children: React.ReactNode;
  loadEndpoints?: () => Promise<FaktsEndpoint[]>;
  staticEndpoints?: FaktsEndpoint[];
  loadOnMount?: boolean;
}) => {
  const [potentialEndpoints, setPotentialEndpoints] =
    useState<FaktsEndpoint[]>(staticEndpoints);

  const loadEndpointsFunc = async () => {
    const endpoints = await loadEndpoints();
    setPotentialEndpoints(endpoints);
    return endpoints;
  };

  useEffect(() => {
    if (loadOnMount) {
      loadEndpoints();
    }
  }, [loadOnMount]);

  return (
    <EndpointsContext.Provider
      value={{
        endpoints: potentialEndpoints,
        load: loadEndpointsFunc,
      }}
    >
      {children}
    </EndpointsContext.Provider>
  );
};
