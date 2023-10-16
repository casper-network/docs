import { useEffect, useCallback, useMemo } from "react";
import useWindow from "./useWindow";

/**
 * ### Sets and removes event listeners
 *
 * @param event A string which represents the event to listen
 * @param callback The callback function for the event listener
 * @param target Target element (window by default)
 * @param options The event listener options
 */
export default function useEventListener(
    event: string,
    callback: (e: any) => void,
    target: HTMLElement | Window | MediaQueryList | undefined = typeof window !== "undefined" ? window : undefined,
    options?: boolean | AddEventListenerOptions,
): void {
    const targetMemo = useMemo<HTMLElement | Window | MediaQueryList | undefined>(() => target, [target]);
    const callbackMemo = useCallback(callback, [callback]);

    useEffect(() => {
        if (!useWindow()) return;
        else {
            const supportsEventListener = targetMemo && targetMemo.addEventListener;

            if (!supportsEventListener || !callbackMemo) return;

            targetMemo.addEventListener(event, callbackMemo, options);

            return () => {
                targetMemo.removeEventListener(event, callbackMemo, options);
            };
        }
    }, [event, options, targetMemo, callbackMemo]);
}
