//clustersearchページを作成

import EyesHeader from 'src/components/parts/EyesHeader'
import VoicesSider from 'src/components/parts/VoicesSider'
import VoicesFooter from 'src/components/parts/EyesFooter'
import ClusterSearchCluster from 'src/components/parts/ClusterSearchCluster'
import ClusterButton from 'src/components/parts/ClusterButton'
import styles from 'src/styles/ClusterSearchPage.module.css'
import { useIsWideScreen } from "src/utils/hooks";
import Head from 'next/head'


const ClusterSearchPage: React.FC = () => {
    //画面サイズの判定
    const isWideScreen = useIsWideScreen();

    return (
        <>
            <Head>
                <link rel="styleSheet" href="https://unpkg.com/destyle.css@1.0.5/destyle.css" />
            </Head>

            <div className={styles.layout}>
                <EyesHeader />

                <div className={styles.display_center_wrapper}>
                    {isWideScreen === null ? null : isWideScreen &&
                        <VoicesSider />
                    }

                    <div className={styles.contents_wrapper}>
                        <div className={styles.searching_word}>
                            <span>検索結果:</span>

                            <span>Sample1</span>
                        </div>

                        <ClusterSearchCluster />
                    </div>
                </div>

                <ClusterButton />

                {isWideScreen === null ? null : !isWideScreen &&
                    <VoicesFooter />
                }
            </div>
        </>
    )
};

export default ClusterSearchPage;