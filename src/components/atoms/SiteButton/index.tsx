import React from "react";
import styles from "./SiteButton.module.scss";
import Link from "@docusaurus/Link";
import icons from "../../../icons";

export interface ISiteButtonProps {
    text: string;
    url: string;
    inverted: boolean;
    disabled?: boolean;
}

export function SiteButton({ text, url, inverted, disabled }: ISiteButtonProps) {
    return (
        <>
            <Link to={url} className={`${styles.button} ${disabled && styles.disabled} ${!inverted ? styles.primary : styles.secondary} `}>
                <div className={`${styles.button_container} ${!inverted ? styles.primary_container : styles.secondary_container}`}>
                    <p>{text}</p>
                    {icons.arrowRight}
                </div>
            </Link>
        </>
    );
}
