import React from "react";
import styles from "./PullQuotes.module.scss";

export interface IPullQuoteProps {
    image: string;
    paragraph: string;
    name: string;
    description: string;
    image_title: string;
}

export function PullQuotes({ image, image_title, paragraph, name, description }: IPullQuoteProps) {
    return (
        <div className={`containerSite`}>
            <div className={`contentBox ${styles.wrapper}`}>
                <div className={`${styles.pullQuotes} span-12`}>
                    <div className={`${styles.card}`}>
                        <div className={styles.image}>
                            <img src={image} alt={image_title ? `${image_title}` : name ? `${name}` : `PullQuote`} />
                        </div>
                        <div className={styles.text}>
                            <div className={styles.paragraph}>
                                <h3 dangerouslySetInnerHTML={{ __html: paragraph! }}></h3>
                            </div>
                            <div className={styles.author}>
                                <p className={`${styles.authorName} halfTitleEyebrow`}>{name}</p>
                                <p className={`primaryParagraph`}>{description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
