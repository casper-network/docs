import React from "react";
import Section from "../../containers/Section";
import styles from "./styles.module.scss";

export interface IImagesProps {
    images: IImage[];
    header?: string;
    subheader?: string;
}

interface IImage {
    numberCol: "full" | "half" | "third";
    image: string;
    name: string;
    image_title: string;
}

export function Images({ images, header, subheader }: IImagesProps) {
    const getSpan = (numberCol: "full" | "half" | "third") => {
        if (numberCol === "full") {
            return "span-12";
        }
        if (numberCol == "half") {
            return "span-6";
        }
        if (numberCol == "third") {
            return "span-4";
        }
        return "span-12";
    };

    return (
        <Section header={header} subheader={subheader}>
            <div className={`${styles.images} containerSite`}>
                <div className={`${styles.images_content} contentBox`}>
                    {images.map((data, index) => (
                        <div className={`${styles.images_content_section} ${getSpan(data.numberCol)}`} key={index}>
                            <img src={data.image} alt={data.image_title ? `${data.image_title}` : data.name ? `${data.name}` : `Images`} />
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    );
}
