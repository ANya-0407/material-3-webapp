//eyesfollowページを作成

import EyesHeader from 'src/components/parts/EyesHeader'
import EyesSider from 'src/components/parts/EyesSider'
import EyesFooter from 'src/components/parts/EyesFooter'
import EyesFollowingList from 'src/components/parts/EyesFollowingList'
import EyesFollowerList from 'src/components/parts/EyesFollowerList'
import styles from 'src/styles/EyesFollowPage.module.css'
import { useState } from 'react'
import { useIsWideScreen } from "src/utils/hooks";
import Head from 'next/head'


const EyesFollowPage: React.FC = () => {
    //画面サイズの判定
    const isWideScreen = useIsWideScreen();

    // 初期値は最初のラジオボタン (following) が選択されている状態
    const [selectedTab, setSelectedTab] = useState('following');

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

                            <input type="radio" id="followers" value="followers" checked={selectedTab === "followers"} onChange={handleChange} />
                            <label htmlFor="followers">
                                {selectedTab === 'followers' &&
                                    <div className={styles.selected_flame}>
                                        <div className={styles.selected_flame_concealing1} />

                                        <div className={styles.selected_flame_concealing2} />

                                        <div className={styles.selected_flame_concealing3} />
                                    </div>
                                }

                                <span>フォロワー</span>
                            </label>
                        </div>

                        {selectedTab === 'following' &&
                            <EyesFollowingList />
                        }

                        {selectedTab === 'followers' &&
                            <EyesFollowerList />
                        }
                    </div>
                </div>

                {isWideScreen === null ? null : !isWideScreen &&
                    <EyesFooter />
                }
            </div>
        </>
    )
};

export default EyesFollowPage;