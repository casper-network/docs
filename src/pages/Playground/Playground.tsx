import React from "react";
import Layout from "@theme/Layout";
import { PlaygroundData } from "@site/src/mocks";
import {
    SiteButton,
    ISiteButtonProps,
    DocsSection,
    FeatureSection,
    Images,
    PullQuotes,
    SocialSection,
    ITagProps,
    Tag,
    BlogSection,
    UseCaseSection,
    NumberSection,
    Paragraph,
    InfoSection,
} from "@site/src/components";
import styles from "./Playground.module.scss";

export default function Playground() {
    return (
        <Layout title="Playground" description="Playground Page">
            <div className="container container-fluid">
                <div className={styles.buttonSection}>
                    {PlaygroundData.playground.buttons.map((x: ISiteButtonProps) => {
                        return <SiteButton key={x.text + x.url} {...x} />;
                    })}
                </div>
                <div className={styles.docsSections}>
                    <DocsSection {...PlaygroundData.playground.docs} />
                </div>
                <div>
                    <FeatureSection {...PlaygroundData.playground.features} />
                </div>
                <div>
                    <Images images={PlaygroundData.playground.images} />
                </div>
                <div>
                    <PullQuotes {...PlaygroundData.playground.pullQuotes} />
                </div>
                <div>
                    <SocialSection {...PlaygroundData.playground.social} />
                </div>
                <div>
                    <BlogSection {...PlaygroundData.playground.blog} />
                </div>
                <div>
                    <UseCaseSection {...PlaygroundData.playground.usecase} />
                </div>
                <div>
                    <NumberSection {...PlaygroundData.playground.numbers} />
                </div>
                <div>
                    <Paragraph {...PlaygroundData.playground.paragraph} />
                </div>
                <div>
                    <InfoSection {...PlaygroundData.playground.infosection} />
                </div>
                <div className={styles.buttonSection}>
                    {PlaygroundData.playground.tags.map((x: ITagProps) => {
                        return <Tag key={x.text + x.url} {...x} />;
                    })}
                </div>
            </div>
        </Layout>
    );
}
