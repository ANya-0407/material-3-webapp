//voicessearchページを作成

import EyesHeader from 'src/components/parts/EyesHeader'
import VoicesSearchVoices from 'src/components/parts/VoicesSearchVoices'
import VoicesButton from 'src/components/parts/VoicesButton'
import VoicesSider from 'src/components/parts/VoicesSider'
import styles from 'src/styles/VoicesSearchPage.module.css'
import Head from 'next/head'


const VoicesSearchPage: React.FC = () => {

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
                        <div className={styles.searching_word}>
                            <span>検索結果:</span>

                            <span>Sample1</span>
                        </div>

                        <VoicesSearchVoices />

                        <VoicesButton />
                    </div>
                </div>
            </div>
        </>
    )
};

export default VoicesSearchPage;