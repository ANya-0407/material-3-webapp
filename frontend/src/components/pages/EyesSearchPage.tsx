//eyessearchページを作成

import EyesHeader from 'src/components/parts/EyesHeader'
import EyesSearchEyes from 'src/components/parts/EyesSearchEyes'
import EyesButton from 'src/components/parts/EyesButton'
import EyesSider from 'src/components/parts/EyesSider'
import EyesFooter from 'src/components/parts/EyesFooter'
import styles from 'src/styles/EyesSearchPage.module.css'
import { useRouter } from "next/router";
import { useIsWideScreen } from "src/utils/hooks";
import Head from 'next/head'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons"


const EyesSearchPage: React.FC = () => {
    //ルーター
    const router = useRouter();

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
                        <EyesSider />
                    }

                    <div className={styles.contents_wrapper}>
                        <div className={styles.contents_upper}>
                            <button className={styles.back_btn} onClick={() => router.back()}>
                                <FontAwesomeIcon icon={faAngleLeft} />
                            </button>

                            <div className={styles.searching_word}>
                                <span>検索結果:</span>

                                <span>Sample1</span>
                            </div>
                        </div>

                        <EyesSearchEyes />
                    </div>
                </div>

                <EyesButton />

                {isWideScreen === null ? null : !isWideScreen &&
                    <EyesFooter />
                }
            </div>
        </>
    )
};

export default EyesSearchPage;