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
import { awaitWithTimeout, fetchWithTimeout } from "./helpers";

export type FaktsProps = {
  children?: any;
  store?: string;
  storageProvider?: StorageProvider;
  retrieve?: (
    endpoint: FaktsEndpoint,
    manifest: Manifest,
    timeout: number
  ) => Promise<Token>;
  introspect?: (url: string, timeout: number) => Promise<FaktsEndpoint>;
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

export const retrieveToken = async (
  endpoint: FaktsEndpoint,
  manifest: Manifest,
  timeout: number
) => {
  let response = await fetchWithTimeout(`${endpoint.base_url}retrieve/`, {
    method: "POST",
    body: JSON.stringify({
      headers: {
        "Content-Type": "application/json",
      },
      manifest: manifest,
    }),
    timeout: timeout,
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

export const introspectUrl = async (
  url: string,
  timeout: number
): Promise<FaktsEndpoint> => {
  url = url.trim();

  if (!url.endsWith("/")) {
    url = url + "/";
  }
  let try_urls = [];

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    try_urls.push("https://" + url);
    try_urls.push("http://" + url);
  } else {
    try_urls.push(url);
  }

  let endpoints = Promise.all(
    try_urls.map(async (url) => {
      try {
        let res = await fetchWithTimeout(url + ".well-known/fakts", {
          timeout: timeout,
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (e) {
        return undefined;
      }
    })
  );

  let endpoint = (await endpoints).find((e) => e !== undefined);
  if (endpoint) {
    return endpoint;
  }
  throw new Error(`No endpoint found on beacon ${url}`);
};

export const FaktsProvider = ({
  children,
  store = "fakts-config",
  storageProvider = localStorageProvider,
  retrieve = retrieveToken,
  introspect = introspectUrl,
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
          request.endpoint = await introspectUrl(
            request.endpoint,
            request.introspectTimeout || 5000
          );
        }

        let token = await retrieve(
          request.endpoint,
          request.manifest,
          request.retrieveTimeout || 5000
        );

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
