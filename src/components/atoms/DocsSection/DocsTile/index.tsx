import Link from "@docusaurus/Link";
import React, { useEffect, useState } from "react";
import styles from "./DocsTile.module.scss";

export interface IDocsTileProps {
    url: string;
    title: string;
    description: string;
    color: string;
    icon: string;
}

export function DocsTile(props: IDocsTileProps) {
    const { url, title, description, color, icon } = props;

    return (
        <>
            <Link to={url} className={`${styles.tilecard} color ${color}`}>
                <div dangerouslySetInnerHTML={{ __html: icon! }} className={styles.tilecard_img}></div>
                <div className={styles.tilecard_text}>
                    <h4>{title}</h4>
                    <p className={`secondaryParagraph`}>{description}</p>
                </div>
            </Link>
        </>
    );
}
