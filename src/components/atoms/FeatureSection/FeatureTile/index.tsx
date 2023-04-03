import React, { useEffect, useState } from "react";
import { SiteButton, ISiteButtonProps } from "../../SiteButton";
import styles from "./FeatureTile.module.scss";

export interface IFeatureTiledProps {
    button: ISiteButtonProps;
    color: string;
    description: string;
    icon: string;
    title: string;
}

export function FeatureTile({ button, color, description, icon, title }: IFeatureTiledProps) {
    return (
        <div className={styles.resourcetilecard}>
            <div dangerouslySetInnerHTML={{ __html: icon! }} className={`${styles.resourcetilecard_img} color ${color}`}></div>
            <div className={styles.resourcetilecard_content}>
                <div className={styles.resourcetilecard_content_text}>
                    <h4>{title}</h4>
                    <p className="primaryParagraph">{description}</p>
                </div>
                <SiteButton {...button} />
            </div>
        </div>
    );
}
