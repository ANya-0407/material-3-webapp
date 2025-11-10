//EyesTrendCardコンポーネントを作成

import { EyesTrendsApiProps, EyesTrendsProps, convertEyesTrendsProps } from "src/types";
import styles from 'src/styles/EyesTrendCard.module.css'
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEarthAsia } from "@fortawesome/free-solid-svg-icons"


const EyesTrendCard: React.FC = () => {
    //ルーター
    const router = useRouter();

    //現在のトレンドを取得
    const [currentTrends, setCurrentTrends] = useState<EyesTrendsProps | null | undefined>(undefined);

    useEffect(() => {
        // サンプルデータ（サーバーの代わり）
        const sampleTrends: EyesTrendsApiProps | null = Math.random() > 0.1 ? {
            local_area: "JP",
            local_trends: [
                "サンプル１",
                "サンプル２",
                "サンプル３",
                "サンプル４",
                "サンプル５",
                "サンプル６",
                "サンプル７",
                "サンプル８",
                "サンプル９"
            ],
            global_trends: [
                "Sample1",
                "Sample2",
                "Sample3",
                "Sample4",
                "Sample5",
                "Sample6",
                "Sample7",
                "Sample8",
                "Sample9"
            ]
        } : null; // 10%の確率で取得失敗

        setTimeout(() => {
            setCurrentTrends(sampleTrends ? convertEyesTrendsProps(sampleTrends) : null);
        }, 1000); // 模擬的に遅延
    }, []);

    //trend_boxのアニメーション制御
    const [currentPhase, setCurrentPhase] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPhase((prevPhase) => (prevPhase + 1) % 3); // 3フェーズをループ
        }, 3000); // フェーズごとに3秒間隔

        return () => clearInterval(interval);
    }, []);

    //トレンドの地域選択
    const [isGlobal, setIsGlobal] = useState(false);

    const handleAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsGlobal(e.target.checked);
    };

    //ルーティング
    const goEyesSearch = (str: string) => {
        router.push(
            { pathname: '/eyessearch/[id]', query: { id: str } }
        );
    };

    return (
        <>
            <div className={styles.eyes_trend_card_wrapper}>
                <div className={styles.trend_card_flame1}>
                    <div className={styles.trend_card_flame1_concealing} />
                </div>

                <div className={styles.trend_card_flame2}>
                    {!currentTrends ? (
                        <div className={styles.trend_card_inner}>
                            <div className={styles.loader} />
                        </div>
                    ) : (
                        <div className={styles.trend_card_inner}>
                            <div className={styles.trend_card_head}>
                                <span>#TREND</span>

                                <h1>{currentTrends.localArea}</h1>

                                <div className={styles.trend_toggle_switch}>
                                    <input id="trend_toggle_switch" type="checkbox" checked={isGlobal} onChange={handleAreaChange} />
                                    <label htmlFor="trend_toggle_switch"></label>
                                </div>

                                <h2><FontAwesomeIcon icon={faEarthAsia} /></h2>
                            </div>

                            {isGlobal ? (
                                <>
                                    {currentTrends.globalTrends.map((trend, index) => (
                                        <button
                                            key={index}
                                            className={`${styles.box} ${styles[`box${index + 1}`]} ${currentPhase === Math.floor(index / 3) ? styles.active : ""}`}
                                            onClick={() => goEyesSearch(trend)}
                                        >
                                            <p>{index + 1}.</p>
                                            <span>#{trend}</span>
                                        </button>
                                    ))}
                                </>
                            ) : (
                                <>
                                    {currentTrends.localTrends.map((trend, index) => (
                                        <button
                                            key={index}
                                            className={`${styles.box} ${styles[`box${index + 1}`]} ${currentPhase === Math.floor(index / 3) ? styles.active : ""}`}
                                            onClick={() => goEyesSearch(trend)}
                                        >
                                            <p>{index + 1}.</p>
                                            <span>#{trend}</span>
                                        </button>
                                    ))}
                                </>
                            )}

                            <div className={styles.trend_card_between_bar1} />

                            <div className={styles.trend_card_between_bar2} />

                            <div className={styles.trend_card_between_bar3} />
                        </div>
                    )}           
                </div>
            </div>
        </>
    )
};

export default EyesTrendCard;