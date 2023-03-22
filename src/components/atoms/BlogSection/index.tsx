import React from "react";
import styles from "./BlogSection.module.scss";
import useWindowWidth from "../../../hooks/useWindowWidth";
import Section from "../../containers/Section";
import { BlogTile, IBlogTileProps } from "./BlogTile";

export interface IBlogSectionProps {
    header: string;
    subheader: string;
    tiles: Array<IBlogTileProps>;
}

export function BlogSection({ header, subheader, tiles }: IBlogSectionProps) {
    const desktop = useWindowWidth(1401);

    const setSpan = (length: number) => {
        switch (length) {
            case 1:
            case 2:
                return 6;
            case 3:
                return 4;
            case 4:
                return 3;
            default:
                return 3;
        }
    };

    const span = setSpan(tiles.length);
    return (
        <Section header={header} subheader={subheader}>
            <div className={`${styles.blogtiles} containerSite`}>
                <div className={`${styles.blogtiles_content} contentBox`}>
                    {tiles.map((data: any, index: number) => (
                        <section className={`${desktop ? "span-4" : ""}`} key={`section-${index}`}>
                            <BlogTile {...{ ...data, ...{ span: span } }} />
                        </section>
                    ))}
                </div>
            </div>
        </Section>
    );
}
