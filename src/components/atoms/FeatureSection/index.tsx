import React from "react";
import { ImageAndTextBlock, IImageAndTextBlockProps } from "../ImageAndTextBlock";
import styles from "./FeatureSection.module.scss";
import { FeatureTile, IFeatureTiledProps } from "./FeatureTile";
import useWindowWidth from "../../../hooks/useWindowWidth";
import Section from "../../containers/Section";

interface IFeatureSectionProps {
    header: string;
    subheader?: string;
    tiles: IFeatureTiledProps[];
    imageAndTextBlock: IImageAndTextBlockProps;
}

export function FeatureSection({ header, subheader, tiles, imageAndTextBlock }: IFeatureSectionProps) {
    return (
        <Section header={header} subheader={subheader}>
            <ImageAndTextBlock {...imageAndTextBlock} />
            <div className={`${styles.resource_content} containerSite`}>
                <section className={`contentBox ${styles.resource_content_box}`}>
                    {tiles.map((data, index) => (
                        <div key={index} className={`${styles.resource_content_card} ${"span-4"}`}>
                            <FeatureTile {...data} />
                        </div>
                    ))}
                </section>
            </div>
        </Section>
    );
}
