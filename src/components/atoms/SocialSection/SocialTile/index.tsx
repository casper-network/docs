import React, { useEffect, useState } from "react";
import styles from "./SocialTile.module.scss";
import { ISiteButtonProps, SiteButton } from "@site/src/components";

export interface ISocialTileProps {
    main_title: string;
    secondary_title: string;
    description: string;
    button: ISiteButtonProps;
    icon: string;
    image?: string;
    image_title: string;
}

export function SocialTile(props: ISocialTileProps) {
    const { main_title, image_title, secondary_title, description, button, icon, image } = props;

    return (
        <div className={styles.socialtilecard}>
            <div className={styles.socialtilecard_text}>
                <div dangerouslySetInnerHTML={{ __html: icon! }} className={styles.text_svg}></div>
                <p className={`${styles.paragraphfirst} secondaryParagraph`} title={secondary_title}>
                    {secondary_title}
                </p>
                <h4 title={main_title}>{main_title}</h4>
                <p className={`${styles.paragraphsecond} secondaryParagraph`} title={description}>
                    {description}
                </p>
                <SiteButton {...{ ...button }} />
            </div>
            <div className={styles.socialtilecard_img}>
                {image && <img alt={image_title ? `${image_title}` : main_title ? `${main_title}` : `SocialTile`} src={image} />}
            </div>
        </div>
    );
}
