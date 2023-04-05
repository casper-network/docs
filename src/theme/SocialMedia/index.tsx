import ISocialMedia from "src/plugins/docusaurus-plugin-navdata/src/interfaces/navbar/socialMedia";
import React from "react";
import styles from "./SocialMedia.module.scss";

interface ISocialMediaProps {
    socialMedia: Array<ISocialMedia>;
}

function SocialMedia(props: ISocialMediaProps) {
    const { socialMedia } = props;
    return (
        <div className={styles.social_icons}>
            <div className={styles.social_icons_container}>
                {socialMedia &&
                    socialMedia.map((social) => {
                        return (
                            <div className={styles.icon} key={social.name}>
                                <a href={social.url!} title={`Go to ${social.name}` ?? "social media"}>
                                    <div dangerouslySetInnerHTML={{ __html: social.icon }} className={styles.tileCard_img}></div>
                                </a>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}

export default SocialMedia;
