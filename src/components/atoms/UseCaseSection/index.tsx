import React from "react";
import styles from "./UseCaseSection.module.scss";
import useWindowWidth from "../../../hooks/useWindowWidth";
import Section from "../../containers/Section";
import { UseCaseTile, IUseCaseTileProps } from "./UseCaseTile";

export interface IUseCaseSectionProps {
    header: string;
    subheader: string;
    tiles: Array<IUseCaseTileProps>;
}

export function UseCaseSection({ header, subheader, tiles }: IUseCaseSectionProps) {
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
            <div className={`${styles.usecasetile} containerSite`}>
                <div className={`${styles.usecasetiles_content} contentBox`}>
                    {tiles.map((data: any, index: number) => (
                        <section className={`${desktop && "span-4"}`} key={`section-${index}`}>
                            <UseCaseTile {...{ ...data, ...{ span: span } }} />
                        </section>
                    ))}
                </div>
            </div>
        </Section>
    );
}
