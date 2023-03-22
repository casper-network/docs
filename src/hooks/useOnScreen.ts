import { useEffect, useState } from "react";

function useOnScreen(ref: any, rootMargin = "0px") {
    // State and setter for storing whether element is visible
    const [isIntersecting, setIntersecting] = useState<boolean>(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Update our state when observer callback fires
                setIntersecting(entry.isIntersecting);
            },
            {
                rootMargin,
            },
        );
        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => {
            if (ref.current) observer.unobserve(ref.current);
        };
    }, []); // Empty array ensures that effect is only run on mount and unmount

    return isIntersecting;
}

export default useOnScreen;
