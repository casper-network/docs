import React from "react";
import Section from "../../containers/Section";
import styles from "./Paragraph.module.scss";

export interface IParagraph {
    header?: string;
    subheader?: string;
    paragraph: string;
}

export function Paragraph({ header, subheader, paragraph }: IParagraph) {
    return paragraph ? (
        <Section header={header} subheader={subheader}>
            <div className={`container`}>
                <div className={`contentBox`}>
                    <div className={paragraph && paragraph.length <= 550 ? `${styles.oneColumn} span-12` : `${styles.twoColumns} span-12`}>
                        <div className={`${styles.paragraph}`}>
                            <p className={`primaryParagraph`} dangerouslySetInnerHTML={{ __html: paragraph! }}></p>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    ) : (
        <></>
    );
}
