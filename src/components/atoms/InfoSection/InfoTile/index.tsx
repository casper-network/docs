import React, { useEffect, useRef, useState } from "react";
import styles from "./InfoTile.module.scss";

export interface IInfoTile {
    title: string;
    content: string;
    image: string;
    image_title: string;
}

export interface IInfoTileProps {
    tile: IInfoTile;
    span: number;
}

export default function InfoTile({ tile, span }: IInfoTileProps) {
    const { title, content, image, image_title } = tile;
    const ref = useRef(null);
    const [addAttribute, setAddAttribute] = useState<boolean>(false);

    useEffect(() => {
        const element = ref.current.scrollHeight;
        if (element > 120) {
            setAddAttribute(true);
        }
    }, []);

    return (
        <div className={`${styles.infoTileWrapper} ${`span-${span}`}`}>
            {image && title && (
                <div className={styles.image}>
                    <img alt={image_title ? `${image_title}` : title ? `${title}` : `InfoSection`} src={image} />
                </div>
            )}
            <h4 className={styles.title}>{title}</h4>
            <p className={`primaryParagraph ${styles.paragraph}`} ref={ref} tabIndex={addAttribute ? 0 : -1}>
                {content}
            </p>
        </div>
    );
}
