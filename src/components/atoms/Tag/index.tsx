import Link from "@docusaurus/Link";
import React from "react";
import styles from "./Tag.module.scss";

export interface ITagProps {
    text: string;
    color: string;
    url: string;
}

export function Tag({ text, color, url }: ITagProps) {
    return (
        <Link to={url} className={`${styles.tag} color ${color}`}>
            <p>{text}</p>
            <span className={`${styles.span}`}></span>
        </Link>
    );
}
