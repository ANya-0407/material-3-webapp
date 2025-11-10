//voicescommentページを作成

import EyesHeader from 'src/components/parts/EyesHeader'
import MainVoices from 'src/components/parts/MainVoices'
import VoicesCommentArea from 'src/components/parts/VoicesCommentArea'
import RelatedVoices from 'src/components/parts/RelatedVoices'
import VoicesButton from 'src/components/parts/VoicesButton'
import VoicesSider from 'src/components/parts/VoicesSider'
import styles from 'src/styles/VoicesCommentPage.module.css'
import Head from 'next/head'


const VoicesCommentPage: React.FC = () => {

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
                        <div className={styles.contents_layout_container}>
                            <div className={styles.contents_layout_left}>
                                <MainVoices />

                                <VoicesCommentArea />
                            </div>

                            <div className={styles.contents_layout_right}>
                                <div className={styles.layout_right_bar} />

                                <RelatedVoices />
                            </div>
                        </div>
                    </div>
                </div>

                <VoicesButton />
            </div>
        </>
    )
};

export default VoicesCommentPage;