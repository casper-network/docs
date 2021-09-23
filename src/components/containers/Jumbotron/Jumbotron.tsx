import React from "react";
import cx from "clsx";

import styles from "./Jumbotron.module.scss";

export interface JumbotronProps {
    className?: string;
    title?: string;
    body?: string | React.ReactNode;
}

export const Jumbotron = (props: JumbotronProps) => {
    return (
        <div className={cx(styles.jumbotron, props.className)}>
            <h1>{props.title || ""}</h1>
            <div className={styles.body}>{props.body}</div>
        </div>
    );
};
