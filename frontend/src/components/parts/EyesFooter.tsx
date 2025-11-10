//EyesFooterコンポーネントを作成

import { EyesSiderApiProps, EyesSiderProps, convertEyesSiderProps } from "src/types";
import styles from 'src/styles/EyesFooter.module.css'
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRightArrowLeft, faHouse, faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons" 
import { faEnvelope, faBell } from "@fortawesome/free-regular-svg-icons" 


const EyesFooter: React.FC = () => {
    //アカウント情報を取得
    const [siderProps, setSiderProps] = useState<EyesSiderProps | null>(null);

    useEffect(() => {
        // サンプルデータ（サーバーの代わり）
        const sampleSiderProps: EyesSiderApiProps | null = Math.random() > 0.1 ? {
            account: {
                account_id: "1",
                account_name: "Amane7",
                account_icon: "https://example.com/image1.jpg"
            },
            is_message_unaware: true,
            is_notice_unaware: true,
            is_wallet_unaware: true
        } : null; // 10%の確率で取得失敗

        setTimeout(() => {
            setSiderProps(sampleSiderProps ? convertEyesSiderProps(sampleSiderProps) : null);
        }, 1000); // 模擬的に遅延
    }, []);

    //リンク
    const router = useRouter();

    //eyeshomeページへのリンク
    const handleClickToEyesHome = () => {
        router.push(`/eyeshome`);
    };

    //eyesmessageページへのリンク
    const handleClickToEyesMessage = () => {
        router.push(`/eyesmessage/`);
    };

    //eyesnoticeページへのリンク
    const handleClickToEyesNotice = () => {
        router.push(`/eyesnotice`);
    };

    //voiceshomeページへのリンク
    const handleClickToVoicesHome = () => {
        router.push(`/voiceshome`);
    };

    return (
        <>
            <nav className={styles.eyes_footer_wrapper}>
                <ul className={styles.contents_menu}>
                    <li>
                        <button className={styles.home_btn} onClick={handleClickToEyesHome}>
                            <span><FontAwesomeIcon icon={faHouse} /></span>
                            Home
                        </button>
                    </li>

                    {!siderProps &&
                        <li>
                            <button className={styles.login_btn}>
                                <span><FontAwesomeIcon icon={faArrowRightToBracket} /></span>
                                Log&nbsp;In
                            </button>
                        </li>
                    }

                    {siderProps &&
                        <li>
                            <button className={styles.message_btn} onClick={handleClickToEyesMessage}>
                                <span>
                                    <FontAwesomeIcon icon={faEnvelope} />

                                    {siderProps.isMessageUnaware &&
                                        <div className={styles.message_unaware_mark}></div>
                                    }
                                </span>
                                Message
                            </button>
                        </li>
                    }

                    {siderProps ? (
                        <li>
                            <button className={styles.notice_btn} onClick={handleClickToEyesNotice}>
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
                </ul>

                <ul className={styles.mode_menu}>
                    <li>
                        <button className={styles.toggle_mode_btn} onClick={handleClickToVoicesHome}>
                            <p>
                                <span><FontAwesomeIcon icon={faArrowRightArrowLeft} /></span>Voices
                            </p>
                        </button>
                    </li>
                </ul>
            </nav>
        </>
    )
};

export default EyesFooter;