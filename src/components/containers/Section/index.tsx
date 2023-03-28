import React, { PropsWithChildren } from "react";
import styles from "./Section.module.scss";

interface ISectionProps {
    header?: string;
    subheader?: string;
    setStyles?: string;
}

function Section({ header, subheader, children, setStyles }: PropsWithChildren<ISectionProps>) {
    return (
        <section className={`${styles.section} ${setStyles ? styles[setStyles] : ""} containerSite`}>
            <div className={`contentBox`}>
                <div className={`${styles.section_content_text} span-12`}>
                    {header && <h2>{header}</h2>}
                    {subheader && <h3 className={`primaryParagraph`}>{subheader}</h3>}
                </div>
            </div>
            <div className={styles.section_children}>{children}</div>
        </section>
    );
}

export default Section;
