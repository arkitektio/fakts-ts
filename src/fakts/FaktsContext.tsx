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
  introspectTimeout?: number;
  retrieveTimeout?: number;
};

export type FaktsInstance = {};

export type Fakts = any;

export type FaktsContext = {
  fakts?: Fakts;
  setFakts: (fakts: Fakts | null) => void;
  load: (request: FaktsRequest) => CancelablePromise<Fakts>;
  registeredEndpoints?: FaktsEndpoint[];
  setRegisteredEndpoints: React.Dispatch<React.SetStateAction<FaktsEndpoint[]>>;
};

export const FaktsContext = React.createContext<FaktsContext>({
  load:  () => { return CancelablePromise.reject(new Error("No FaktsProvider found"))},
  setFakts: () => { throw new Error("No FaktsProvider found")},
  setRegisteredEndpoints: () => { throw new Error("No FaktsProvider found") },
});

export const useFakts = () => useContext(FaktsContext);
