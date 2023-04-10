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

export type FaktsRemoteGrant = {
  endpoint: FaktsEndpoint;
  ademand: (endpoint: FaktsEndpoint) => Promise<Token>;
};

export const buildFaktsRetrieveGrant = (
  endpoint: FaktsEndpoint,
  manifest: Manifest
) => {
  return {
    endpoint: endpoint,
    manifest: manifest,
    ademand: async (endpoint: FaktsEndpoint) => {
      let response = await fetch(`${endpoint.base_url}retrieve/`, {
        method: "POST",
        body: JSON.stringify({
          headers: {
            "Content-Type": "application/json",
          },
          manifest: manifest,
        }),
      });
      if (response.ok) {
        let json = await response.json();
        if (json.status == "error") {
          throw new Error(json.message);
        }
        if (json.token) {
          return json.token;
        }
        throw new Error("Malformed response");
      }
    },
  };
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
