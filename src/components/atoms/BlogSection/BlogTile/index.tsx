import React from "react";
import styles from "./BlogTile.module.scss";
import { ISiteButtonProps, SiteButton } from "../../SiteButton";

export interface IBlogTileProps {
    image: string;
    category: string;
    title: string;
    date: string;
    button: ISiteButtonProps;
    span: number;
    image_title: string;
}

export function BlogTile({ image, image_title, category, title, span, date, button }: IBlogTileProps) {
    return (
        <div className={`${styles.card} span-${span}`}>
            <div className={`${styles.card_img}`}>
                <img src={image} alt={image_title ? `${image_title}` : title ? `${title}` : `BlogTile`} />
            </div>
            <div className={styles.card_content}>
                <div className={styles.text}>
                    <div className={styles.header}>
                        <div className={styles.title}>
                            <p className="halfTitleEyebrow">{category}</p>
                        </div>
                    </div>
                    <div className={styles.paragraph}>
                        <h4>{title}</h4>
                    </div>
                </div>
                <div className={`${styles.bottomBlog}`}>
                    <div className={styles.buttonLearn}>
                        <SiteButton {...button} />
                    </div>
                    <div className={`${styles.date}`}>
                        <p className="secondaryParagraph"> {date} </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
