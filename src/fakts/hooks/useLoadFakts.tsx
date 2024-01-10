import { useCallback, useState } from "react";
import { CancelableRequest, Fakts, FaktsRequest, useFakts } from "../FaktsContext";


export const useLoadFakts = (request: FaktsRequest) => {
    const {load: faktsLoad, setFakts, fakts, registeredEndpoints, registerEndpoints } = useFakts()
    const [progress, setProgress] = useState<string | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);
    const [promise, setPromise] = useState<CancelableRequest<Fakts> | null>(null);
   

    const load = useCallback((other: Partial<FaktsRequest> = {}) => {
        if (promise) {
            promise.cancel();
        }
        else {

            let causedRequest = {...request, ...other}

            let manifest = causedRequest.manifest;


            if (causedRequest.requestedClientType == "website" && !causedRequest.requestedRedirectURIs) {
                throw new Error("No redirect URI specified, but requested website, please set requestedRedirectURIs")
            }

            if (!manifest) {
                throw new Error("No manifest")
            }

            setError(undefined)
            const newPromise = faktsLoad({
                ...causedRequest, 
                manifest,
                onProgress: (progress) => {
                    causedRequest.onProgress && causedRequest.onProgress(progress)
                    setProgress(progress);
                }
            });
            
            newPromise.promise.then(x => {
                setPromise(null)
                setProgress(undefined)
            
            
            }).catch((e) => {
                console.log("Error", e);
                
                setPromise(null)
                setError(e.message)
            })



            setPromise(newPromise)
        }
    }
    , [promise]);


    const remove = useCallback(() => {
        if (promise) {
            promise.cancel();
        }
        else {
            setFakts(null)
        }
    }, [promise])
    
    console.log("rerender")

    return {
        progress,
        loading : promise != null,
        load,
        remove,
        error,
        fakts,
        registerEndpoints,
        registeredEndpoints,
    }

} 
