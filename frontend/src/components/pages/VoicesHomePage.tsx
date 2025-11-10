//voiceshomeページを作成

import EyesHeader from 'src/components/parts/EyesHeader'
import VoicesHomeAll from 'src/components/parts/VoicesHomeAll'
import VoicesHomeFollowing from 'src/components/parts/VoicesHomeFollowing'
import VoicesHomeCluster from 'src/components/parts/VoicesHomeCluster'
import VoicesButton from 'src/components/parts/VoicesButton'
import VoicesSider from 'src/components/parts/VoicesSider'
import styles from 'src/styles/VoicesHomePage.module.css'
import { useState } from 'react'
import Head from 'next/head'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUsers } from "@fortawesome/free-solid-svg-icons"


const VoicesHomePage: React.FC = () => {

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
                    <VoicesSider />

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

                            <input type="radio" id="cluster" value="cluster" checked={selectedTab === "cluster"} onChange={handleChange} />
                            <label htmlFor="cluster">
                                {selectedTab === 'cluster' &&
                                    <div className={styles.selected_flame}>
                                        <div className={styles.selected_flame_concealing1} />

                                        <div className={styles.selected_flame_concealing2} />

                                        <div className={styles.selected_flame_concealing3} />
                                    </div>
                                }

                                <span><FontAwesomeIcon icon={faUsers} /> クラスター</span>
                            </label>
                        </div>

                        {selectedTab === 'all' &&
                            <div>
                                <VoicesHomeAll />

                                <VoicesButton />
                            </div>
                        }

                        {selectedTab === 'following' &&
                            <div>
                                <VoicesHomeFollowing />

                                <VoicesButton />
                            </div>
                        }

                        {selectedTab === 'cluster' &&
                            <div>
                                <VoicesHomeCluster />
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
};

export default VoicesHomePage;