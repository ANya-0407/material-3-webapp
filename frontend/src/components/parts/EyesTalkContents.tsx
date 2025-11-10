//EyesTalkContentsコンポーネントを作成

import EyesTalkContentsHeader from 'src/components/parts/EyesTalkContentsHeader';
import EyesTalkContentsCenter from 'src/components/parts/EyesTalkContentsCenter';
import EyesTalkContentsFooter from 'src/components/parts/EyesTalkContentsFooter';
import { EyesTalkApiProps, EyesTalkProps, convertEyesTalkProps } from "src/types";
import styles from 'src/styles/EyesTalkContents.module.css'
import React, { useState, useEffect } from "react";


const EyesTalkContents: React.FC = () => {
    //URLの会話を取得
    const [currentTalk, setCurrentTalk] = useState<EyesTalkProps | null | undefined>(undefined);

    useEffect(() => {
        // サンプルデータ（サーバーの代わり）
        const sampleTalk: EyesTalkApiProps | null = Math.random() > 0.1 ? {
            talk_id: "a",
            talk_name: "Amane1",
            talk_icon: "/samples/image1.jpg",
            members: [
                {
                    account_id: "a",
                    account_name: "Amane2",
                    account_icon: "/samples/image2.jpg"
                },
                {
                    account_id: "b",
                    account_name: "Amane3",
                    account_icon: "/samples/image3.jpg"
                }
            ],
            is_group: false,
            is_silent: false,
            is_invisible: false,
            is_friend: true,
        } : null; // 10%の確率で取得失敗

        setTimeout(() => {
            setCurrentTalk(sampleTalk ? convertEyesTalkProps(sampleTalk) : null);
        }, 1000); // 模擬的に遅延
    }, []);

    return (
        <>
            <div className={styles.eyes_talk_contents_wrapper}>
                <EyesTalkContentsHeader talk={currentTalk} />

                <EyesTalkContentsCenter talk={currentTalk} />

                <EyesTalkContentsFooter talk={currentTalk} />
            </div>
        </>
    )
};

export default EyesTalkContents;