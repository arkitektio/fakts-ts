import { useCallback, useState } from "react";
import { CancelableRequest, Fakts, FaktsRequest, useFakts } from "../FaktsContext";


export const useLoadFakts = (request: FaktsRequest) => {
    const {load } = useFakts()
    const [progress, setProgress] = useState<string | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);
    const [promise, setPromise] = useState<CancelableRequest<Fakts> | null>(null);

    const causeLoad = useCallback((other: Partial<FaktsRequest> = {}) => {
        if (promise) {
            promise.cancel();
        }
        else {

            let causedRequest = {...request, ...other}

            setError(undefined)
            const newPromise = load({...causedRequest, 
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
                
                setPromise(p => null)
                setError(e.message)
            })



            setPromise(newPromise)
        }
    }
    , [promise]);
    
    console.log("rerender")

    return {
        progress,
        ongoing : promise != null,
        causeLoad,
        error
    }

} 
