import { CancelablePromise } from "cancelable-promise";
import React, { useEffect, useState } from "react";
import {
  Fakts,
  FaktsContext,
  FaktsEndpoint,
  FaktsRequest,
  Manifest,
  Token,
} from "./FaktsContext";
import { introspectUrl } from "./helpers";

export type FaktsProps = {
  children?: any;
  store?: string;
  storageProvider?: StorageProvider;
  retrieve?: (endpoint: FaktsEndpoint, manifest: Manifest) => Promise<Token>;
};

export type StorageProvider = {
  set(key: string, value: string): Promise<void>;
  get(key: string): Promise<string | null>;
};

export const localStorageProvider = {
  set: async (key: string, value: any) => {
    localStorage.setItem(key, value);
  },
  get: async (key: string) => {
    return localStorage.getItem(key);
  },
};

const fetchRetrieve = async (endpoint: FaktsEndpoint, manifest: Manifest) => {
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
};

export const FaktsProvider = ({
  children,
  store = "fakts-config",
  storageProvider = localStorageProvider,
  retrieve = fetchRetrieve,
}: FaktsProps) => {
  const [faktsState, setConfigState] = useState<any | null>(null);

  const setFakts = (configState?: Fakts | undefined) => {
    storageProvider
      .set(store, configState ? JSON.stringify(configState) : "")
      .then(() => {
        setConfigState(configState);
      });
  };

  const load = (request: FaktsRequest) => {
    console.log("Loading");

    let abortController = new AbortController();

    let result = new CancelablePromise(async (resolve, reject, onCancel) => {
      onCancel(() => {
        abortController.abort();
      });
      try {
        if (typeof request.endpoint === "string") {
          request.endpoint = await introspectUrl(request.endpoint);
        }

        let token = await retrieve(request.endpoint, request.manifest);

        let response = await fetch(`${request.endpoint.base_url}claim/`, {
          method: "POST",
          body: JSON.stringify({
            headers: {
              "Content-Type": "application/json",
            },
            token: token,
          }),
          signal: abortController.signal,
        });

        if (response.ok) {
          let json = await response.json();
          if (json.config) {
            setFakts(json.config);
            resolve(json.config);
          } else {
            reject(new Error(`Malformed response: ${JSON.stringify(json)}`));
          }
        } else {
          reject(new Error(`Non 202 Statuscode : ${response.statusText}`));
        }
      } catch (e) {
        reject(e);
      }
    });

    return result;
  };

  useEffect(() => {
    storageProvider.get(store).then((value) => {
      if (value) {
        setConfigState(JSON.parse(value));
      }
    });
  }, [store]);

  return (
    <FaktsContext.Provider
      value={{
        fakts: faktsState,
        setFakts: setFakts,
        load: load,
      }}
    >
      {children}
    </FaktsContext.Provider>
  );
};
