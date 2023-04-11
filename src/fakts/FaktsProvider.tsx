import { CancelablePromise } from "cancelable-promise";
import React, { useEffect, useState } from "react";
import {
  Fakts,
  FaktsContext,
  FaktsEndpoint,
  FaktsRemoteGrant,
} from "./FaktsContext";

export type FaktsProps = {
  children?: any;
  store?: string;
  storageProvider?: StorageProvider;
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

export const FaktsProvider: React.FC<FaktsProps> = ({
  children,
  store = "fakts-config",
  storageProvider = localStorageProvider,
}) => {
  const [faktsState, setConfigState] = useState<any | null>(null);

  const setFakts = (configState?: Fakts | undefined) => {
    storageProvider
      .set(store, configState ? JSON.stringify(configState) : "")
      .then(() => {
        setConfigState(configState);
      });
  };

  const load = (grant: FaktsRemoteGrant) => {
    console.log("Loading");

    let abortController = new AbortController();

    let result = new CancelablePromise(async (resolve, reject, onCancel) => {
      onCancel(() => {
        abortController.abort();
      });
      try {
        let token = await grant.ademand(grant.endpoint);

        let response = await fetch(`${grant.endpoint.base_url}claim/`, {
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
