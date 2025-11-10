//voicesprofileページを作成

import EyesHeader from 'src/components/parts/EyesHeader'
import VoicesProfileInfo from 'src/components/parts/VoicesProfileInfo'
import VoicesProfileVoices from 'src/components/parts/VoicesProfileVoices'
import VoicesProfileMovie from 'src/components/parts/VoicesProfileMovie'
import VoicesProfileBoard from 'src/components/parts/VoicesProfileBoard'
import VoicesSider from 'src/components/parts/VoicesSider'
import styles from 'src/styles/VoicesProfilePage.module.css'
import React, { useState } from "react"
import Head from 'next/head'


const VoicesProfilePage: React.FC = () => {

    // 初期値は最初のラジオボタン (tweet) が選択されている状態
    const [selectedTab, setSelectedTab] = useState<string>("voices");

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
                        <VoicesProfileInfo />

                        <div className={styles.radio_btn_wrapper}>
                            <input id="voices" type="radio" value="voices" checked={selectedTab === "voices"} onChange={handleChange} />
                            <label htmlFor="voices" style={{ color: selectedTab === 'voices' ? '#fafafa' : '#696969' }}>
                                <div style={{ background: selectedTab === 'voices' ? '#404040' : '#ffffff' }} />
                                <span>Voices</span>
                            </label>

                            <input id="movie" type="radio" value="movie" checked={selectedTab === "movie"} onChange={handleChange} />
                            <label htmlFor="movie" style={{ color: selectedTab === 'movie' ? '#fafafa' : '#696969' }}>
                                <div style={{ background: selectedTab === 'movie' ? '#404040' : '#ffffff' }} />
                                <span>Movie</span>
                            </label>

                            <input id="board" type="radio" value="board" checked={selectedTab === "board"} onChange={handleChange} />
                            <label htmlFor="board" style={{ color: selectedTab === 'board' ? '#fafafa' : '#696969' }}>
                                <div style={{ background: selectedTab === 'board' ? '#404040' : '#ffffff' }} />
                                <span>Board</span>
                            </label>

                            <div className={styles.radio_btn_line1} />
                            <div className={styles.radio_btn_line2} />
                        </div>

                        {selectedTab === 'voices' &&
                            <VoicesProfileVoices />
                        }

                        {selectedTab === 'movie' &&
                            <VoicesProfileMovie />
                        }

                        {selectedTab === 'board' &&
                            <VoicesProfileBoard />
                        }
                    </div>
                </div>


            </div>
        </>
    )
};

export default VoicesProfilePage;