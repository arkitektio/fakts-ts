import React, { useContext } from "react";
export type HealthyJSON = { [element: string]: string };
import { CancelablePromise } from "cancelable-promise";
export type FaktsEndpoint = {
  base_url: string;
  name: string;
};

export type FaktsRemoteGrant = {
  endpoint: FaktsEndpoint;
  clientId: string;
  clientSecret: string;
};

export type FaktsInstance = {};

export type Fakts = any;

export type FaktsContext = {
  fakts?: Fakts;
  setFakts: (fakts: Fakts | null) => void;
  load: (grant: FaktsRemoteGrant) => CancelablePromise<Fakts>;
};

export const FaktsContext = React.createContext<FaktsContext>({
  load: () => null as unknown as CancelablePromise<Fakts>,
  setFakts: () => {},
});

export const useFakts = () => useContext(FaktsContext);
