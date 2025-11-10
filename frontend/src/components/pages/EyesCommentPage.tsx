//eyescommentページを作成

import EyesHeader from 'src/components/parts/EyesHeader'
import MainEyes from 'src/components/parts/MainEyes'
import EyesCommentArea from 'src/components/parts/EyesCommentArea'
import FriendsEyes from 'src/components/parts/FriendsEyes'
import RelatedEyes from 'src/components/parts/RelatedEyes'
import EyesButton from 'src/components/parts/EyesButton'
import EyesSider from 'src/components/parts/EyesSider'
import EyesFooter from 'src/components/parts/EyesFooter'
import { EyesApiProps, EyesProps, convertEyesProps } from "src/types";
import styles from 'src/styles/EyesCommentPage.module.css'
import Head from 'next/head'
import React, { useState, useEffect } from "react";
import { useIsWideScreen } from "src/utils/hooks";


const EyesCommentPage: React.FC = () => {
    //画面サイズの判定
    const isWideScreen = useIsWideScreen();

    //URLの投稿を取得
    const [mainEyes, setMainEyes] = useState<EyesProps | null | undefined>(undefined);

    useEffect(() => {
        // サンプルデータ（サーバーの代わり）
        const sampleEyes: EyesApiProps | null = Math.random() > 0.1 ? {
            eyes_id: "1",
            poster: {
                account_id: "a",
                account_name: "Amane1",
                account_icon: "/samples/image7.jpg"
            },
            image: "/samples/image11.jpg",
            tag: "これはサンプルです。意味はありません。",
            hashtag: "#Sample",
            created_at: "2025-01-01T12:00:00Z",
            view_count: 95000,
            good_count: 25000,
            is_own: false,
            is_good_for_me: true,
            is_my_bookmark: false
        } : null; // 10%の確率で取得失敗

        setTimeout(() => {
            setMainEyes(sampleEyes ? convertEyesProps(sampleEyes) : null);
        }, 2000); // 模擬的に遅延
    }, []);

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
                        <div className={styles.contents_layout_container}>
                            <div className={styles.contents_layout_left}>
                                <MainEyes eyes={mainEyes} />

                                <EyesCommentArea eyes={mainEyes} />
                            </div>

                            <div className={styles.contents_layout_right}>
                                <FriendsEyes eyes={mainEyes} />

                                <RelatedEyes eyes={mainEyes} />
                            </div>
                        </div>
                    </div>
                </div>

                <EyesButton />

                {isWideScreen === null ? null : !isWideScreen &&
                    <EyesFooter />
                }
            </div>
        </>
    )
};

export default EyesCommentPage;