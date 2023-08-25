import { Beacon, FaktsEndpoint } from "./FaktsContext";

function mstimeout(ms: number) {
  return new Promise((resolve, reject) =>
    setTimeout(() => reject(Error(`Timeout after ${ms}`)), ms)
  );
}

export async function awaitWithTimeout<T>(
  promise: Promise<T>,
  ms: number
): Promise<T> {
  return (await Promise.race([promise, mstimeout(ms)])) as T;
}

type ExpandedRequestInit = RequestInit & { timeout?: number };

export async function fetchWithTimeout(
  resource: RequestInfo,
  options?: ExpandedRequestInit
) {
  let id: NodeJS.Timeout | undefined = undefined;
  if (options?.timeout) {
    const controller = new AbortController();
    id = setTimeout(() => controller.abort(), options.timeout);

    options.signal = controller.signal;
    delete options.timeout;
  }

  const response = await fetch(resource, {
    ...options,
  });
  if (id) {
    clearTimeout(id);
  }

  return response;
}
