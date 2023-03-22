import React from "react";
import styles from "./styles.module.scss";
import useWindowWidth from "../../../hooks/useWindowWidth";

export interface IImagesProps {
    images: IImage[];
}

interface IImage {
    numberCol: "full" | "half" | "third";
    image: string;
    name: string;
    image_title: string;
}

export function Images({ images }: IImagesProps) {
    const isDesktop = useWindowWidth(996);
    return (
        <section className={`${styles.images} containerSite`}>
            <div className={`${styles.images_content} contentBox`}>
                {images.map((data, index) => (
                    <div
                        className={`${styles.images_content_section} ${
                            data.numberCol == "full"
                                ? "span-12"
                                : data.numberCol == "half" && isDesktop
                                ? "span-6"
                                : data.numberCol == "third" && isDesktop
                                ? "span-4"
                                : "span-12"
                        } `}
                        key={index}
                    >
                        <img src={data.image} alt={data.image_title ? `${data.image_title}` : data.name ? `${data.name}` : `Images`} />
                    </div>
                ))}
            </div>
        </section>
    );
}
