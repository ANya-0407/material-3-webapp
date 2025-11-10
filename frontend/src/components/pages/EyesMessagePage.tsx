//eyesmessageページを作成

import EyesHeader from 'src/components/parts/EyesHeader'
import EyesFriendsAddressList from 'src/components/parts/EyesFriendsAddressList'
import EyesPublicAddressList from 'src/components/parts/EyesPublicAddressList'
import EyesRequestList from 'src/components/parts/EyesRequestList'
import EyesTalkContents from 'src/components/parts/EyesTalkContents'
import EyesRequestContents from 'src/components/parts/EyesRequestContents'
import EyesSider from 'src/components/parts/EyesSider'
import EyesFooter from 'src/components/parts/EyesFooter'
import styles from 'src/styles/EyesMessagePage.module.css'
import { useState } from 'react'
import { useIsWideScreen } from "src/utils/hooks";
import Head from 'next/head'


const EyesMessagePage: React.FC = () => {
    //画面サイズの判定
    const isWideScreen = useIsWideScreen();

    // 初期値は最初のラジオボタン (friends) が選択されている状態
    const [selectedTab, setSelectedTab] = useState<string>("friends");

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
                        {selectedTab === 'friends' &&
                            <EyesFriendsAddressList />
                        }

                        {selectedTab === 'public' &&
                            <EyesPublicAddressList />
                        }

                        {selectedTab === 'request' &&
                            <EyesRequestList />
                        }

                        <div className={styles.contents_right}>
                            <div className={styles.radio_btn_wrapper}>
                                <input type="radio" id="friends" value="friends" checked={selectedTab === "friends"} onChange={handleChange} />
                                <label htmlFor="friends">
                                    {selectedTab === 'friends' &&
                                        <div className={styles.selected_flame}>
                                            <div className={styles.selected_flame_concealing1} />

                                            <div className={styles.selected_flame_concealing2} />

                                            <div className={styles.selected_flame_concealing3} />
                                        </div>
                                    }

                                    <span>Friends</span>
                                </label>

                                <input type="radio" id="public" value="public" checked={selectedTab === "public"} onChange={handleChange} />
                                <label htmlFor="public">
                                    {selectedTab === 'public' &&
                                        <div className={styles.selected_flame}>
                                            <div className={styles.selected_flame_concealing1} />

                                            <div className={styles.selected_flame_concealing2} />

                                            <div className={styles.selected_flame_concealing3} />
                                        </div>
                                    }

                                    <span>Public</span>
                                </label>

                                <input type="radio" id="request" value="request" checked={selectedTab === "request"} onChange={handleChange} />
                                <label htmlFor="request">
                                    {selectedTab === 'request' &&
                                        <div className={styles.selected_flame}>
                                            <div className={styles.selected_flame_concealing1} />

                                            <div className={styles.selected_flame_concealing2} />

                                            <div className={styles.selected_flame_concealing3} />
                                        </div>
                                    }

                                    <span>Requests</span>
                                </label>
                            </div>

                            {(selectedTab === 'friends' || selectedTab === 'public') &&
                                <EyesTalkContents />
                            }

                            {selectedTab === 'request' &&
                                <EyesRequestContents />
                            }
                        </div>
                    </div>
                </div>

                {isWideScreen === null ? null : !isWideScreen &&
                    <EyesFooter />
                }
            </div>
        </>
    )
};

export default EyesMessagePage;