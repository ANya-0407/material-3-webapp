//notfoundページを作成

import Head from 'next/head'
import styles from 'src/styles/NotFoundPage.module.css'
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleDot } from "@fortawesome/free-regular-svg-icons"


const NotFoundPage: React.FC = () => {
    //ルーター
    const router = useRouter();

    //ルーティング
    const goEyesHome = () => router.push(`/eyshome`);
    const goVoicesHome = () => router.push(`/voiceshome`);

    return (
        <>
            <Head>
                <link rel="styleSheet" href="https://unpkg.com/destyle.css@1.0.5/destyle.css" />
            </Head>

            <div className={styles.layout}>
                <h1>404 - Page Not Found</h1>

                <p>ホームに戻る</p>

                <div className={styles.btn_container}>
                    <button className={styles.eyes_home_btn} onClick={goEyesHome}>
                        <div></div>
                        <span>Eyes</span>
                    </button>

                    <button className={styles.voices_home_btn} onClick={goVoicesHome}>
                        <div></div>
                        <span>Voices</span>
                    </button>
                </div>

                <div className={styles.canvas}>
                    <div className={styles.pink_frame}>
                    </div>

                    <div className={styles.blue_frame}>
                    </div>

                    <div className={styles.inner}>
                        <div className={styles.eyes_tytle}>
                            Eyes
                        </div>

                        <div className={styles.eyes_explanation}>
                            実世界での自らの姿を発信することを想定。<br />
                            身近なユーザーとの繋がりを重視。
                        </div>

                        <div className={styles.bar}></div>

                        <div className={styles.eyes_characteristics}>
                            <span><FontAwesomeIcon icon={faCircleDot} /></span>&nbsp;画像/動画の共有に特化し、<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;ユーザーの相互関係を重視した機能<br />
                            <br />
                            <span><FontAwesomeIcon icon={faCircleDot} /></span>&nbsp;ライブ機能等の実装も予定
                        </div>

                        <div className={styles.voices_tytle}>
                            Voices
                        </div>

                        <div className={styles.voices_explanation}>
                            日常の喜びや自らの意見を広範囲に<br />
                            発信・共有。主に匿名の利用が多いこと<br />
                            を想定。
                        </div>
                    </div>

                    <div className={styles.zeta_division} />

                    <div className={styles.cluster_frame}>
                        <div className={styles.cluster_tytle}>
                            Cluster
                        </div>

                        <span>
                            掲示板形式の機能<br/>
                            匿名性: 高
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
};

export default NotFoundPage;