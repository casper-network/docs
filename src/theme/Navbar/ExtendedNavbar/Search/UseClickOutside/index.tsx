import { useEffect } from "react";

const events = [`mousedown`, `touchstart`];

export default (ref: any, onClickOutside: any) => {
    const isOutside = (element: any) => !ref.current || !ref.current.contains(element);

    const onClick = (event: any) => {
        if (isOutside(event.target)) {
            onClickOutside();
        }
    };

    useEffect(() => {
        for (const event of events) {
            document.addEventListener(event, onClick);
        }

        return () => {
            for (const event of events) document.removeEventListener(event, onClick);
        };
    });
};
