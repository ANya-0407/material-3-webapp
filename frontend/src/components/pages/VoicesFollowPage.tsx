//voicesfollowページを作成

import EyesHeader from 'src/components/parts/EyesHeader'
import VoicesSider from 'src/components/parts/VoicesSider'
import EyesFooter from 'src/components/parts/EyesFooter'
import VoicesFollowingList from 'src/components/parts/VoicesFollowingList'
import VoicesFollowerList from 'src/components/parts/VoicesFollowerList'
import styles from 'src/styles/VoicesFollowPage.module.css'
import { useState } from 'react'
import { useIsWideScreen } from "src/utils/hooks";
import Head from 'next/head'


const VoicesFollowPage: React.FC = () => {
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
                        <VoicesSider />
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
                            <VoicesFollowingList />
                        }

                        {selectedTab === 'followers' &&
                            <VoicesFollowerList />
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

export default VoicesFollowPage;