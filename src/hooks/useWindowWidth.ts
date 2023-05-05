import { useRef, useState, useLayoutEffect } from "react";
/**
 * Checks if the window matches any given width
 *
 * @param {number} width
 */

const isBrowser = typeof window !== "undefined";

const useWindowWidth = (width: number) => {
    const mediaQuery = useRef(isBrowser ? window.matchMedia(`(min-width: ${width}px)`) : null);
    const [match, setMatch] = useState<boolean>(mediaQuery.current?.matches ? mediaQuery.current.matches : false);
    const handleMatchToggle = ({ matches }: any) => setMatch(matches);

    useLayoutEffect(() => {
        const ref = mediaQuery.current;
        const supportsEventListener = ref && ref.addEventListener;
        handleMatchToggle(mediaQuery.current);

        if (supportsEventListener) ref.addEventListener("change", handleMatchToggle);
        else ref?.addListener(handleMatchToggle);
        return () => {
            if (supportsEventListener) ref.removeEventListener("change", handleMatchToggle);
            else ref?.removeListener(handleMatchToggle);
        };
    }, []);

    return match;
};

export default useWindowWidth;
