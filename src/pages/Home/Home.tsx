import React from "react";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { translate } from "@docusaurus/Translate";

import { Hero, Jumbotron } from "@site/src/components";

import styles from "./Home.module.scss";

const HomePage = () => {
    const context = useDocusaurusContext();
    const { siteConfig = {} } = context;

    return (
        <Layout title="Home" description="Home">
            <div className={styles.homePage}>
                <header>
                    <Hero title={siteConfig.title} subTitle={siteConfig.tagline} actionLabel="Get Started" actionTo="/">
                        <Jumbotron
                            title={translate({
                                id: "homepage.jumbotron.title",
                                description: "The title of jumbotron",
                                message: "State-of-the-art search for technical documentation",
                            })}
                            body={
                                <React.Fragment>
                                    <p>
                                        We&apos;re kind of scratching our own itch here. As developers, we spend a lot of time reading documentation, and it
                                        isn’t always easy to find the information we need.
                                    </p>
                                    <p>
                                        No one&apos;s to blame, building a good search is a complex challenge. We just happen to have a lot of experience doing
                                        that, and we want to share it with the developer community.
                                    </p>
                                </React.Fragment>
                            }
                        />
                    </Hero>
                </header>
                <main>
                    <section className={styles.jumbotron}></section>
                </main>
            </div>
        </Layout>
    );
};

export default HomePage;
