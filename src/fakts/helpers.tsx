import { Beacon, FaktsEndpoint } from "./FaktsContext";

export const introspectBeacon = async (
  beacon: Beacon
): Promise<FaktsEndpoint> => {
  let url = beacon.url;
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
        let res = await fetch(url + ".well-known/fakts");
        if (res.ok) {
          return await res.json();
        }
      } catch (e) {
        console.log("Failed to fetch", url, e);
      }
    })
  );

  let endpoint = (await endpoints).find((e) => e !== undefined);
  if (endpoint) {
    return endpoint;
  }
  throw new Error(`No endpoint found on beacon ${url}`);
};
