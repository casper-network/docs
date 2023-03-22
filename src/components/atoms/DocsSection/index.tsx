import React from "react";
import styles from "./DocsSection.module.scss";
import { DocsTile, IDocsTileProps } from "./DocsTile";
import useWindowWidth from "../../../hooks/useWindowWidth";
import Section from "../../containers/Section";

export interface IDocsSectionProps {
    header: string;
    subheader: string;
    tiles: Array<IDocsTileProps>;
}

export function DocsSection({ header, subheader, tiles }: IDocsSectionProps) {
    return (
        <Section header={header} subheader={subheader}>
            <div className={`${styles.docstiles} containerSite`}>
                <div className={`${styles.docstiles_content} contentBox`}>
                    {tiles.map((data: any, index: number) => (
                        <section className={`${"span-4"}`} key={`section-${index}`}>
                            <DocsTile color={data.color} icon={data.icon} description={data.description} title={data.title} url={data.url} />
                        </section>
                    ))}
                </div>
            </div>
        </Section>
    );
}
