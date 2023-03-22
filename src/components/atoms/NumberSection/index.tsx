import React from "react";
import styles from "./NumberSection.module.scss";
import { Number, INumberProps } from "./Number";
import useWindowWidth from "../../../hooks/useWindowWidth";
import Section from "../../containers/Section";
import useOnScreen from "../../../hooks/useOnScreen";

export interface INumberSectionProps {
    header: string;
    subheader: string;
    numbers: Array<INumberProps>;
    text?: string;
}

export function NumberSection({ header, subheader, numbers, text }: INumberSectionProps) {
    const desktop = useWindowWidth(1401);

    // Ref for the element that we want to detect whether on screen
    const ref = React.useRef<HTMLDivElement>(null);
    // Call the hook passing in ref and root margin
    // In this case it would only be considered onScreen if more ...
    // ... than 300px of element is visible.
    let onScreen = useOnScreen(ref, "150px");
    //

    return (
        <Section header={header} subheader={subheader}>
            <div className={` ${styles.number_section} containerSite`}>
                <div className={`${styles.number_section_box} contentBox`}>
                    {numbers.map((data: any, index: number) => (
                        <div className={`${styles.number_section_box_span} ${desktop ? "span-4" : ""}`} key={`number-${index}`}>
                            <Number number={data.number} description={data.description} onScreen={onScreen} />
                        </div>
                    ))}
                </div>
                <div className={`contentBox`}>
                    <div className={`${styles.number_section_text} span-12`} ref={ref}>
                        <p>{text}</p>
                    </div>
                </div>
            </div>
        </Section>
    );
}
