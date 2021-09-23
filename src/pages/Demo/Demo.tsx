import React from "react";
import Layout from "@theme/Layout";

import { Card, CardProps } from "@site/src/components";
import { CommonUtil } from "@site/src/utils";
import { DemoData } from "@site/src/mocks";

import styles from "./Demo.module.scss";

const DemoPage = () => {
    return (
        <Layout title="Demo" description="">
            <div className={styles.demoPage}>
                <main>
                    {DemoData.demo.map((item: CardProps, index) => (
                        <Card
                            key={CommonUtil.generateKey(item.title, index)}
                            className={styles.cardItem}
                            title={item.title}
                            info={item.info}
                            image={item.image}
                            source={item.source}
                            url={item.url}
                        />
                    ))}
                </main>
            </div>
        </Layout>
    );
};

export default DemoPage;
