//clusterページを作成

import EyesHeader from 'src/components/parts/EyesHeader'
import VoicesSider from 'src/components/parts/VoicesSider'
import VoicesFooter from 'src/components/parts/EyesFooter'
import ClusterInfoPC from 'src/components/parts/ClusterInfoPC'
import ClusterCommentArea from 'src/components/parts/ClusterCommentArea'
import ClusterCommentButton from 'src/components/parts/ClusterCommentButton'
import { ClusterApiProps, ClusterProps, convertClusterProps } from "src/types";
import styles from 'src/styles/ClusterPage.module.css'
import { useState, useEffect } from "react"
import { useIsWideScreen } from "src/utils/hooks";
import Head from 'next/head'


const ClusterPage: React.FC = () => {
    //画面サイズの判定
    const isWideScreen = useIsWideScreen();

    //URLのアカウントのプロフィールを取得
    const [cluster, setCluster] = useState<ClusterProps | null | undefined>(undefined);

    useEffect(() => {
        // サンプルデータ（サーバーの代わり）
        const sampleCluster: ClusterApiProps | null = Math.random() > 0.1 ? {
            cluster_id: "1",
            cluster_name: "Group1",
            header_image: "/samples/image2.jpg",
            cluster_explanation: "『Neverness to Everness』（NTE）はHotta Studioが自主開発した超現実アーバンオープンワールドRPGです。 Discord：https://discord.gg/ntejp YouTube：https://youtube.com/@NevernesstoEvernessJP",
            creator: {
                alias_id: "a",
                alias_name: "Amane7",
                alias_icon: "/samples/image6.jpg"
            },
            created_at: "2025-01-01T12:00:00Z",
            participants_number: 19,
            is_participating: false,
        } : null; // 10%の確率で取得失敗

        setTimeout(() => {
            setCluster(sampleCluster ? convertClusterProps(sampleCluster) : null);
        }, 1000); // 模擬的に遅延
    }, []);

    return (
        <>
            <Head>
                <link rel="styleSheet" href="https://unpkg.com/destyle.css@1.0.5/destyle.css" />
            </Head>

            <div className={styles.layout}>
                <EyesHeader />

                <div className={styles.display_center_wrapper}>
                    <VoicesSider />

                    <div className={styles.contents_wrapper}>
                        {isWideScreen === null ? null : isWideScreen ? (
                            <ClusterInfoPC cluster={cluster} />
                        ) : (
                            <>
                            </>
                        )}

                        <ClusterCommentArea cluster={cluster} />
                    </div>
                </div>

                <ClusterCommentButton />

                {isWideScreen === null ? null : !isWideScreen &&
                    <VoicesFooter />
                }
            </div>
        </>
    )
};

export default ClusterPage;