import React, { useEffect, useState } from "react";
import styles from "./Number.module.scss";

export interface INumberProps {
    number: number;
    description: string;
    onScreen: boolean;
}

export function Number({ number, description, onScreen }: INumberProps) {
    const [count, setCount] = useState<number>(0);
    const [intervalId, setIntervalId] = useState<NodeJS.Timer>();
    const [init, setInit] = useState<Boolean>(false);
    const time = 1600;
    const minimumGap = 25;

    useEffect(() => {
        if (onScreen && !init) {
            setInit(true);
            let timeGap = time / number;
            if (timeGap < minimumGap) {
                timeGap = minimumGap;
            }

            const factor = time / timeGap;
            const numberGap = number / factor;

            const id = setInterval(() => setCount((oldCount) => oldCount + numberGap), timeGap);
            setIntervalId(id);
        }
    }, [onScreen]);

    useEffect(() => {
        if (intervalId && count >= number) {
            clearInterval(intervalId);
        }
    }, [count]);

    return (
        <div className={styles.container}>
            <div className={styles.container_number}>
                <div>{count >= number ? number : Math.floor(count)}</div>
            </div>
            <div className={styles.container_description}>
                <p className="primaryParagraph">{description}</p>
            </div>
        </div>
    );
}
