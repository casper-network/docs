import React from "react";
import { ISiteButtonProps, SiteButton } from "../SiteButton";
import InfoTile, { IInfoTile, IInfoTileProps } from "./InfoTile";
import styles from "./InfoSection.module.scss";
import Section from "../../containers/Section";

interface IInfoSectionProps {
    tiles: IInfoTile[];
    button?: ISiteButtonProps;
    header?: string;
    subheader?: string;
}

export function InfoSection({ tiles, button, header, subheader }: IInfoSectionProps) {
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
            <div className={`${styles.wrapper} containerSite`}>
                <div className={`${styles.tileContent} contentBox`}>
                    {tiles &&
                        tiles.map((tile, i) => {
                            return <InfoTile key={`info_tile_${i}`} {...{ ...{ tile }, ...{ span } }} />;
                        })}
                </div>
                {button && <SiteButton {...button} />}
            </div>
        </Section>
    );
}
