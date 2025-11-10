//EyesSiderコンポーネントを作成

import { EyesSiderApiProps, EyesSiderProps, convertEyesSiderProps } from "src/types";
import styles from 'src/styles/EyesSider.module.css'
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRightArrowLeft, faHouse, faCirclePlay, faCoins, faMoneyCheckDollar, faGear, faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons" 
import { faEnvelope, faBell, faUser, faBookmark, faCircleQuestion } from "@fortawesome/free-regular-svg-icons" 


const EyesSider: React.FC = () => {
    //ルーター
    const router = useRouter();

    //アカウント情報を取得
    const [siderProps, setSiderProps] = useState<EyesSiderProps | undefined | null>(undefined);

    useEffect(() => {
        // サンプルデータ（サーバーの代わり）
        const sampleSiderProps: EyesSiderApiProps | null = Math.random() > 0.1 ? {
            account: {
                account_id: "1",
                account_name: "Amane7",
                account_icon: "/samples/image2.jpg"
            },
            is_message_unaware: true,
            is_notice_unaware: true,
            is_wallet_unaware: true
        } : null; // 10%の確率で取得失敗

        setTimeout(() => {
            setSiderProps(sampleSiderProps ? convertEyesSiderProps(sampleSiderProps) : null);
        }, 1000); // 模擬的に遅延
    }, []);

    //レイアウト変更
    const [showMoreMenu1, setShowMoreMenu1] = useState(false);
    const [showMoreMenu2, setShowMoreMenu2] = useState(false);
    const [showMoreMenu3, setShowMoreMenu3] = useState(false);
    const [showMoreMenu4, setShowMoreMenu4] = useState(false);
    const [showMoreMenu5, setShowMoreMenu5] = useState(false);

    useEffect(() => {
        const updateVisibility = () => {
            const height = window.innerHeight;

            setShowMoreMenu1(height > 600);
            setShowMoreMenu2(height > 650);
            setShowMoreMenu3(height > 700);
            setShowMoreMenu4(height > 750);
            setShowMoreMenu5(height > 800);
        };

        // 初回実行
        updateVisibility();

        // ウィンドウリサイズ時に更新
        window.addEventListener("resize", updateVisibility);
        return () => window.removeEventListener("resize", updateVisibility);
    }, []);

    //画像のalt
    const iconAlt = siderProps?.account.accountName
        ? `Icon Image: ${siderProps.account.accountName}`
        : ``;

    //ルーティング
    const goVoicesHome = () => router.push('/voiceshome');
    const goEyesProfile = () => {
        const accountId = siderProps?.account.accountId;
        if (!accountId) return; 

        router.push(
            { pathname: '/eyesprofile/[id]', query: { id: accountId } },
            undefined,
            { shallow: true } 
        );
    };
    const goEyesHome = () => router.push('/eyeshome');
    const goEyesMessage = () => router.push('/eyesmessage');
    const goEyesNotice = () => router.push('/eyesnotice');
    const goLive = () => router.push('/live');
    const goWallet = () => router.push('/wallet');
    const goEyesFollow = () => router.push('/eyesfollow');
    const goEyesBookmark = () => router.push('/eyesbookmark');
    const goAds = () => router.push('/ads');
    const goHelp = () => router.push('/help');
    const goSetting = () => router.push('/setting');
    const goLogin = () => router.push('/login');

    return (
        <>
            <nav className={styles.eyes_sider_wrapper}>
                <ul className={styles.mode_menu}>
                    <li>
                        <button className={styles.toggle_mode_btn} onClick={goVoicesHome}>
                            <p>
                                <span><FontAwesomeIcon icon={faArrowRightArrowLeft} /></span>Voices
                            </p>
                        </button>
                    </li>
                </ul>

                {siderProps &&
                    <ul className={styles.icon_image_frame}>
                        <li>
                            <div className={styles.account_icon_wrapper} onClick={goEyesProfile}>
                                <Image
                                    className={styles.account_icon}
                                    src={siderProps.account.accountIcon}
                                    alt={iconAlt}
                                    fill
                                    priority={false}
                                />
                            </div>
                        </li>
                    </ul>
                }

                <ul className={styles.contents_menu}>
                    <li>
                        <button className={styles.home_btn} onClick={goEyesHome}>
                            <span><FontAwesomeIcon icon={faHouse} /></span>
                            Home
                        </button>
                    </li>

                    {!siderProps &&
                        <li>
                            <button className={styles.help_btn} onClick={goHelp}>
                                <span><FontAwesomeIcon icon={faCircleQuestion} /></span>
                                Help
                            </button>
                        </li>
                    }

                    {siderProps === null &&
                        <li>
                            <button className={styles.login_btn} onClick={goLogin}>
                                <span><FontAwesomeIcon icon={faArrowRightToBracket} /></span>
                                Log&nbsp;In
                            </button>
                        </li>
                    }

                    {siderProps ? (
                        <li>
                            <button className={styles.message_btn} onClick={goEyesMessage}>
                                <span>
                                    <FontAwesomeIcon icon={faEnvelope} />

                                    {siderProps.isMessageUnaware &&
                                        <div className={styles.message_unaware_mark}></div>
                                    }
                                </span>
                                Message
                            </button>
                        </li>
                    ): (
                        <div className={styles.message_btn} style={{ color: "#bababa" }}>
                            <span><FontAwesomeIcon icon={faEnvelope} /></span>
                            Message
                        </div>
                    )}

                    {siderProps ? (
                        <li>
                            <button className={styles.notice_btn} onClick={goEyesNotice}>
                                <span>
                                    <FontAwesomeIcon icon={faBell} />

                                    {siderProps.isNoticeUnaware &&
                                        <div className={styles.notice_unaware_mark}></div>
                                    }
                                </span>
                                Notice
                            </button>
                        </li>
                    ) : (
                        <div className={styles.notice_btn} style={{ color: "#bababa" }}>
                            <span><FontAwesomeIcon icon={faBell} /></span>
                            Notice
                        </div>
                    )}

                    {siderProps ? (
                        <li>
                            <button className={styles.live_btn} onClick={goLive}>
                                <span><FontAwesomeIcon icon={faCirclePlay} /></span>
                                Live
                            </button>
                        </li>
                    ) : (
                        <div className={styles.live_btn} style={{ color: "#bababa" }}>
                            <span><FontAwesomeIcon icon={faCirclePlay} /></span>
                            Live
                        </div>
                    )}

                    {showMoreMenu1 &&
                        <>
                            {siderProps ? (
                                <li>
                                    <button className={styles.wallet_btn} onClick={goWallet}>
                                        <span>
                                            <FontAwesomeIcon icon={faCoins} />

                                            {siderProps.isWalletUnaware &&
                                                <div className={styles.wallet_unaware_mark}></div>
                                            }
                                        </span>
                                        Wallet
                                    </button>
                                </li>
                            ) : (
                                <div className={styles.wallet_btn} style={{ color: "#bababa" }}>
                                    <span><FontAwesomeIcon icon={faCoins} /></span>
                                    Wallet
                                </div>
                            )}
                        </>
                    }

                    {showMoreMenu2 &&
                        <>
                            {siderProps ? (
                                <li>
                                    <button className={styles.follow_btn} onClick={goEyesFollow}>
                                        <span><FontAwesomeIcon icon={faUser} /></span>
                                        Follow
                                    </button>
                                </li>
                            ) : (
                                <div className={styles.follow_btn} style={{ color: "#bababa" }}>
                                    <span><FontAwesomeIcon icon={faUser} /></span>
                                    Follow
                                </div>
                            )}
                        </>
                    }

                    {showMoreMenu4 &&
                        <>
                            {siderProps ? (
                                <li>
                                    <button className={styles.bookmark_btn} onClick={goEyesBookmark}>
                                        <span><FontAwesomeIcon icon={faBookmark} /></span>
                                        Bookmark
                                    </button>
                                </li>
                            ) : (
                                <div className={styles.bookmark_btn} style={{ color: "#bababa" }}>
                                    <span><FontAwesomeIcon icon={faBookmark} /></span>
                                    Bookmark
                                </div>
                            )}
                        </>
                    }

                    {showMoreMenu5 &&
                        <>
                            {siderProps ? (
                                <li>
                                    <button className={styles.ads_btn} onClick={goAds}>
                                        <span><FontAwesomeIcon icon={faMoneyCheckDollar} /></span>
                                        Ads
                                    </button>
                                </li>
                            ) : (
                                <div className={styles.ads_btn} style={{ color: "#bababa" }}>
                                    <span><FontAwesomeIcon icon={faMoneyCheckDollar} /></span>
                                    Ads
                                </div>
                            )}
                        </>
                    }

                    {showMoreMenu3 &&
                        <>
                            {siderProps &&
                                <li>
                                    <button className={styles.help_btn} onClick={goHelp}>
                                        <span><FontAwesomeIcon icon={faCircleQuestion} /></span>
                                        Help
                                    </button>
                                </li>
                            }
                        </>
                    }

                    {siderProps ? (
                        <li>
                            <button className={styles.setting_btn} onClick={goSetting}>
                                <span><FontAwesomeIcon icon={faGear} /></span>
                                Setting
                            </button>
                        </li>
                    ) : (
                        <div className={styles.setting_btn} style={{ color: "#bababa" }}>
                            <span><FontAwesomeIcon icon={faGear} /></span>
                            Setting
                        </div>
                    )}
                </ul>
            </nav>
        </>
    )
};

export default EyesSider;