import React from "react";
import styles from "./SocialSection.module.scss";
import { ISocialTileProps, SocialTile } from "./SocialTile";
import Section from "../../containers/Section";

interface ISocialSectionProps {
    header: string;
    subheader: string;
    tiles: ISocialTileProps[];
}

export function SocialSection({ header, subheader, tiles }: ISocialSectionProps) {
    return (
        <Section header={header} subheader={subheader} setStyles={"social_section"}>
            <div className={`${styles.socialtiles} containerSite`}>
                <div className={`${styles.socialtiles_content} contentBox`}>
                    {tiles.map((data: any, index: number) => (
                        <section className={`${"span-4"}`} key={`section-${index}`}>
                            <SocialTile {...data} />
                        </section>
                    ))}
                </div>
            </div>
        </Section>
    );
}
