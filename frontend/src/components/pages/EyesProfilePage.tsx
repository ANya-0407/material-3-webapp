//eyesprofileページを作成

import EyesHeader from 'src/components/parts/EyesHeader'
import EyesSider from 'src/components/parts/EyesSider'
import EyesFooter from 'src/components/parts/EyesFooter'
import EyesProfileInfo from 'src/components/parts/EyesProfileInfo'
import EyesProfileEyes from 'src/components/parts/EyesProfileEyes'
import EyesProfileMemories from 'src/components/parts/EyesProfileMemories'
import EyesProfileMovie from 'src/components/parts/EyesProfileMovie'
import EyesProfileBoard from 'src/components/parts/EyesProfileBoard'
import EyesButton from 'src/components/parts/EyesButton'
import { EyesProfilePageInfoApiProps, EyesProfilePageInfoProps, convertEyesProfilePageInfoProps } from "src/types";
import styles from 'src/styles/EyesProfilePage.module.css'
import { useState, useEffect } from "react";
import { useIsWideScreen } from "src/utils/hooks";
import Head from 'next/head'


const EyesProfilePage: React.FC = () => {
    //画面サイズの判定
    const isWideScreen = useIsWideScreen();

    //URLのアカウントのプロフィールを取得
    const [profile, setProfile] = useState<EyesProfilePageInfoProps | null | undefined>(undefined);

    useEffect(() => {
        // サンプルデータ（サーバーの代わり）
        const sampleProfile: EyesProfilePageInfoApiProps | null = Math.random() > 0.1 ? {
            main_info: {
                account_id: "buzz4047",
                account_name: "Amane7",
                account_icon: "/samples/image2.jpg",
            },
            header_image: "/samples/image12.jpg",
            account_explanation: "『Neverness to Everness』（NTE）はHotta Studioが自主開発した超現実アーバンオープンワールドRPGです。 Discord：https://discord.gg/ntejp YouTube：https://youtube.com/@NevernesstoEvernessJP",
            following_number: 221,
            followers_number: 1714,
            birthday: "2007-04-07",
            is_own: true,
            live_id: "114514"
        } : null; // 10%の確率で取得失敗

        setTimeout(() => {
            setProfile(sampleProfile ? convertEyesProfilePageInfoProps(sampleProfile) : null);
        }, 1000); // 模擬的に遅延
    }, []);

    // 初期値は最初のラジオボタン (tweet) が選択されている状態
    const [selectedTab, setSelectedTab] = useState<string>("eyes");

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
                        <EyesProfileInfo profile={profile} />

                        <div className={styles.radio_btn_wrapper}>
                            <input type="radio" id="eyes" value="eyes" checked={selectedTab === "eyes"} onChange={handleChange} />
                            <label htmlFor="eyes">
                                {selectedTab === 'eyes' &&
                                    <div className={styles.selected_flame}>
                                        <div className={styles.selected_flame_concealing1} />

                                        <div className={styles.selected_flame_concealing2} />

                                        <div className={styles.selected_flame_concealing3} />
                                    </div>
                                }

                                <span>Eyes</span>
                            </label>

                            <input type="radio" id="movie" value="movie" checked={selectedTab === "movie"} onChange={handleChange} />
                            <label htmlFor="movie">
                                {selectedTab === 'movie' &&
                                    <div className={styles.selected_flame}>
                                        <div className={styles.selected_flame_concealing1} />

                                        <div className={styles.selected_flame_concealing2} />

                                        <div className={styles.selected_flame_concealing3} />
                                    </div>
                                }

                                <span>Movie</span>
                            </label>

                            <input type="radio" id="board" value="board" checked={selectedTab === "board"} onChange={handleChange} />
                            <label htmlFor="board">
                                {selectedTab === 'board' &&
                                    <div className={styles.selected_flame}>
                                        <div className={styles.selected_flame_concealing1} />

                                        <div className={styles.selected_flame_concealing2} />

                                        <div className={styles.selected_flame_concealing3} />
                                    </div>
                                }

                                <span>Board</span>
                            </label>
                        </div>

                        {selectedTab === 'eyes' &&
                            <EyesProfileEyes profile={profile} />
                        }

                        {selectedTab === 'memory' &&
                            <EyesProfileMemories profile={profile} />
                        }

                        {selectedTab === 'movie' &&
                            <EyesProfileMovie profile={profile} />
                        }

                        {selectedTab === 'board' &&
                            <EyesProfileBoard profile={profile} />
                        }
                    </div>
                </div>

                {selectedTab === "eyes" &&
                    <EyesButton />
                }

                {isWideScreen === null ? null : !isWideScreen &&
                    <EyesFooter />
                }
            </div>
        </>
    )
};

export default EyesProfilePage;