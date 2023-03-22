import React from "react";
import useWindowWidth from "../../../hooks/useWindowWidth";
import { SiteButton, ISiteButtonProps } from "../SiteButton";
import styles from "./ImageAndTextBlock.module.scss";

enum elements {
    text,
    image,
}

export interface IImageAndTextBlockProps {
    image: string;
    title: string;
    description: string;
    button: ISiteButtonProps;
    textAlign: "left" | "right";
    textSize: "1/3" | "1/2";
    dateData?: string;
    image_title: string;
}

export function ImageAndTextBlock({ image, image_title, title, description, button, textAlign, textSize, dateData }: IImageAndTextBlockProps) {
    const isDesktop = useWindowWidth(970);
    function spanHandler(textSize: string, element: elements): string {
        if (textSize === "1/3" && isDesktop) {
            if (element === elements.image) return "span-8";
            // if the element is a text, the function return span-4
            else return "span-4";
        } else if (textSize === "1/2" && isDesktop) return "span-6";
        else return "span-12";
    }

    return (
        <section className={`${styles.ImageAndTextBlock} containerSite`}>
            <div className={`${styles.ImageAndTextBlock_content}  contentBox ${textAlign === "left" && styles.grid_invert}`}>
                <div className={`${styles.ImageAndTextBlock_content_img} ${spanHandler(textSize, elements.image)}`}>
                    <img alt={image_title ? `${image_title}` : title ? `${title}` : `ImageAndTextBlock`} src={image} />
                </div>
                <div className={`${styles.ImageAndTextBlock_content_text} ${spanHandler(textSize, elements.text)}`}>
                    {dateData && <p className={`${styles.date} secondaryParagraph`}>{dateData}</p>}
                    <h4>{title}</h4>
                    <p className={`primaryParagraph`}>{description}</p>
                    <SiteButton {...button} />
                </div>
            </div>
        </section>
    );
}
