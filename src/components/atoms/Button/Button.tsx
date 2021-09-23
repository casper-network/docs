import React from "react";
import cx from "clsx";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";

import styles from "./Button.module.scss";

export type ButtonVariant = "primary" | "secondary";

export interface ButtonProps {
    className?: string;
    label?: string;
    variant?: ButtonVariant;
    to?: string;
}

export const Button = (props: ButtonProps) => {
    return (
        <Link className={cx(styles.button, props.variant || "primary", props.className || "")} to={props.to || "/"}>
            {props.label || ""}
        </Link>
    );
};
