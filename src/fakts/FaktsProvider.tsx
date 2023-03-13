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
};

export const FaktsProvider: React.FC<FaktsProps> = ({
  children,
  store = "fakts-config",
}) => {
  const [faktsState, setConfigState] = useState<any | null>(null);
  const [activeGrant, setActiveGrant] = useState<
    FaktsRemoteGrant | undefined
  >();

  const setFakts = (configState?: Fakts | undefined) => {
    setConfigState(configState);
    localStorage.setItem(store, configState ? JSON.stringify(configState) : "");
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
          }
        } else {
          reject(response);
        }
      } catch (e) {
        reject(e);
      }
    });

    return result;
  };

  useEffect(() => {
    const value = localStorage.getItem(store);

    if (value) {
      setConfigState(JSON.parse(value));
    }
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
