import React from "react";
import cx from "clsx";

import styles from "./Card.module.scss";

export interface CardProps {
    className?: string;
    title: string;
    info?: string;
    image?: string;
    source?: string;
    url?: string;
}

export const Card = (props) => {
    return (
        <div className={cx(styles.card, styles.className)}>
            <div className={styles.cardImage}>
                <img src={props.image || ""} alt="card-image" />
            </div>
            <div className={styles.cardInfo}>
                <h4>{props.title}</h4>
                <p>{props.info || ""}</p>
            </div>
            <div className={styles.cardFooter}>
                <a href={props.url} target="_blank" rel="noreferrer">
                    Website
                </a>
                <a href={props.source} target="_blank" rel="noreferrer">
                    Source
                </a>
            </div>
        </div>
    );
};
