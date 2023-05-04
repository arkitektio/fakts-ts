import React, { useContext } from "react";
export type HealthyJSON = { [element: string]: string };
import { CancelablePromise } from "cancelable-promise";
export type FaktsEndpoint = {
  base_url: string;
  name: string;
};

export type Beacon = {
  url: string;
};

export type Manifest = {
  version: string;
  identifier: string;
  logo?: string;
};

export type Token = string;

export type FaktsRequest = {
  endpoint: FaktsEndpoint | string;
  manifest: Manifest;
};

export type FaktsInstance = {};

export type Fakts = any;

export type FaktsContext = {
  fakts?: Fakts;
  setFakts: (fakts: Fakts | null) => void;
  load: (request: FaktsRequest) => CancelablePromise<Fakts>;
};

export const FaktsContext = React.createContext<FaktsContext>({
  load: () => null as unknown as CancelablePromise<Fakts>,
  setFakts: () => {},
});

export const useFakts = () => useContext(FaktsContext);
