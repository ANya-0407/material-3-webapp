//eyeshomeページを作成

import EyesHeader from 'src/components/parts/EyesHeader'
import EyesHomeAll from 'src/components/parts/EyesHomeAll'
import EyesHomeFollowing from 'src/components/parts/EyesHomeFollowing'
import EyesHomeMemories from 'src/components/parts/EyesHomeMemories'
import EyesButton from 'src/components/parts/EyesButton'
import EyesSider from 'src/components/parts/EyesSider'
import EyesFooter from 'src/components/parts/EyesFooter'
import styles from 'src/styles/EyesHomePage.module.css'
import { useState } from 'react'
import { useIsWideScreen } from "src/utils/hooks";
import Head from 'next/head'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faImage } from "@fortawesome/free-regular-svg-icons"


const EyesHomePage: React.FC = () => {
    //画面サイズの判定
    const isWideScreen = useIsWideScreen();

    // 初期値は最初のラジオボタン (all) が選択されている状態
    const [selectedTab, setSelectedTab] = useState<string>("all");

    // ラジオボタンが変更されたときに呼ばれる関数
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedTab(event.target.value);
    };

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
                        <div className={styles.radio_btn_wrapper}>
                            <input type="radio" id="all" value="all" checked={selectedTab === "all"} onChange={handleChange} />
                            <label htmlFor="all">
                                {selectedTab === 'all' &&
                                    <div className={styles.selected_flame}>
                                        <div className={styles.selected_flame_concealing1} />

                                        <div className={styles.selected_flame_concealing2} />

                                        <div className={styles.selected_flame_concealing3} />
                                    </div>
                                }

                                <span>おすすめ</span>
                            </label>

                            <input type="radio" id="following" value="following" checked={selectedTab === "following"} onChange={handleChange} />
                            <label htmlFor="following">
                                {selectedTab === 'following' &&
                                    <div className={styles.selected_flame}>
                                        <div className={styles.selected_flame_concealing1} />

                                        <div className={styles.selected_flame_concealing2} />

                                        <div className={styles.selected_flame_concealing3} />
                                    </div>
                                }

                                <span>フォロー中</span>
                            </label>

                            <input type="radio" id="memories" value="memories" checked={selectedTab === "memories"} onChange={handleChange} />
                            <label htmlFor="memories">
                                {selectedTab === 'memories' &&
                                    <div className={styles.selected_flame}>
                                        <div className={styles.selected_flame_concealing1} />

                                        <div className={styles.selected_flame_concealing2} />

                                        <div className={styles.selected_flame_concealing3} />
                                    </div>
                                }

                                <span><FontAwesomeIcon icon={faImage} /> メモリー</span>
                            </label>
                        </div>

                        {selectedTab === 'all' &&
                            <EyesHomeAll />
                        }

                        {selectedTab === 'following' &&
                            <EyesHomeFollowing />
                        }

                        {selectedTab === 'memories' &&
                            <EyesHomeMemories />
                        }
                    </div>
                </div>

                {(selectedTab === "all" || selectedTab === "following") &&
                    <EyesButton />
                }

                {isWideScreen === null ? null : !isWideScreen &&
                    <EyesFooter />
                }
            </div>
        </>
    )
};

export default EyesHomePage;