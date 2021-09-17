import React from "react";
import cx from "clsx";

import styles from "./Background.module.scss";

export interface BackgroundProps {
    className?: string;
    children?: React.ReactNode;
}

export const Background = (props: BackgroundProps) => {
    return <div className={cx(styles.background, props.className)}>{props.children}</div>;
};
