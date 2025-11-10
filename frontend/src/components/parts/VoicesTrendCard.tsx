//VoicesTrendCardコンポーネントを作成

import styles from 'src/styles/VoicesTrendCard.module.css'
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEarthAsia } from "@fortawesome/free-solid-svg-icons"


//サンプルデータ
const voicesTrendList = [
    "サンプル１",
    "サンプル２",
    "サンプル３",
    "サンプル４",
    "サンプル５",
    "サンプル６",
    "サンプル７",
    "サンプル８",
    "サンプル９"
];


const VoicesTrendCard: React.FC = () => {
    //ルーター
    const router = useRouter();

    //trend_boxのアニメーション制御
    const [currentPhase, setCurrentPhase] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPhase((prevPhase) => (prevPhase + 1) % 3); // 3フェーズをループ
        }, 3000); // フェーズごとに3秒間隔

        return () => clearInterval(interval);
    }, []);

    //ルーティング
    const goVoicesSearch = (str: string) => {
        router.push(
            { pathname: '/voicessearch/[id]', query: { id: str } }
        );
    };

    return (
        <>
            <div className={styles.voices_trend_card_wrapper}>
                <div className={styles.trend_card_flame1}>
                    <div className={styles.trend_card_flame1_concealing} />
                </div>

                <div className={styles.trend_card_flame2}>
                    <div className={styles.trend_card_inner}>
                        <div className={styles.trend_card_head}>
                            <span>#TREND</span>

                            <h1>JP</h1>

                            <div className={styles.trend_toggle_switch}>
                                <input id="trend_toggle_switch" type="checkbox" />
                                <label htmlFor="trend_toggle_switch"></label>
                            </div>

                            <h2><FontAwesomeIcon icon={faEarthAsia} /></h2>
                        </div>

                        {voicesTrendList.map((trend, index) => (
                            <button
                                key={index}
                                className={`${styles.box} ${styles[`box${index + 1}`]} ${currentPhase === Math.floor(index / 3) ? styles.active : ""}`}
                                onClick={() => goVoicesSearch(trend)}
                            >
                                <p>{index + 1}.</p>
                                <span>#{trend}</span>
                            </button>
                        ))}

                        <div className={styles.trend_card_between_bar1} />

                        <div className={styles.trend_card_between_bar2} />

                        <div className={styles.trend_card_between_bar3} />
                    </div>
                </div>
            </div>
        </>
    )
};

export default VoicesTrendCard;