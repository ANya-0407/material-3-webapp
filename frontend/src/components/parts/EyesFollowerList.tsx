//EyesFollowerListコンポーネントを作成

import EyesFollowerProfileCard from 'src/components/parts/EyesFollowerProfileCard';
import { EyesFollowProfileApiProps, EyesFollowProfileProps, convertEyesFollowProfileProps } from "src/types";
import styles from 'src/styles/EyesFollowerList.module.css';
import { useRouter } from "next/router";
import React, { useState, useRef, useEffect, useCallback } from "react";

// サーバーの代わりとなるサンプルデータ
const sampleProfiles: (EyesFollowProfileApiProps | null)[] = [
    {
        account_id: "1",
        account_name: "Amane1",
        account_icon: "/samples/image1.jpg",
        account_explanation: "This is a sample. It has no meaning.",
        is_official: true,
        is_mutual: true
    },
    {
        account_id: "2",
        account_name: "Amane2",
        account_icon: "/samples/image2.jpg",
        account_explanation: "This is a sample. It has no meaning.",
        is_official: true,
        is_mutual: false
    },
    {
        account_id: "3",
        account_name: "Amane3",
        account_icon: "/samples/image3.jpg",
        is_official: false,
        is_mutual: false
    },
    null,
];

const EyesFollowerList: React.FC = () => {
    // ルーター
    const router = useRouter();

    // プロファイルの状態管理（センターカラムのみ使用）
    const [centerProfiles, setCenterProfiles] = useState<EyesFollowProfileProps[]>([]);

    // カラムのDOM参照
    const centerColumnRef = useRef<HTMLDivElement | null>(null);

    // 初回ロードの状況
    const isFirstLoadCompleteRef = useRef(false);

    // IntersectionObserver用の監視要素
    const centerSentinelRef = useRef<HTMLDivElement | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    // サーバーのデータが尽きたことを示すフラグ
    const [noMoreProfiles, setNoMoreProfiles] = useState(false);
    const serverDataRef = useRef<(EyesFollowProfileApiProps | null)[]>([...sampleProfiles]);

    // サーバーからプロファイルを1件ずつ取得する関数
    const fetchProfiles = useCallback(async (): Promise<EyesFollowProfileProps | null> => {
        if (noMoreProfiles) return null;
        const profile = serverDataRef.current.shift();
        if (profile === undefined) return null;
        if (profile === null) {
            setNoMoreProfiles(true);
            return null;
        }
        return convertEyesFollowProfileProps(profile);
    }, [noMoreProfiles]);

    // 指定したカラムの高さを取得する関数
    const getColumnHeight = (column: HTMLDivElement | null): number => {
        if (!column) return 0;
        const rect = column.getBoundingClientRect();
        const lastChild = column.lastElementChild as HTMLElement | null;
        return lastChild ? lastChild.getBoundingClientRect().bottom - rect.top : 0;
    };

    // プロファイルをセンターカラムに振り分ける関数
    const distributeProfiles = useCallback(async () => {
        if (noMoreProfiles) return;
        const profile = await fetchProfiles();
        if (!profile) return;
        setCenterProfiles(prev => [...prev, profile]);
    }, [fetchProfiles, noMoreProfiles]);

    // 初回ロードと追加プロファイルの管理（IntersectionObserver を使用）
    useEffect(() => {
        // 初回ロード
        if (!isFirstLoadCompleteRef.current) {
            (async () => {
                document.body.style.overflow = "hidden";
                let centerHeight = 0;

                while (centerHeight < window.innerHeight * 3) {
                    if (noMoreProfiles) break; // プロファイルが尽きたらループ終了

                    await distributeProfiles();

                    // 少し待ってから高さを更新
                    await new Promise(resolve => setTimeout(resolve, 50));
                    centerHeight = getColumnHeight(centerColumnRef.current);
                }

                isFirstLoadCompleteRef.current = true;
                document.body.style.overflow = "";
            })();
        };

        if (noMoreProfiles) return;

        // 監視対象の要素を取得（センターカラムのみ）
        const target = centerSentinelRef.current;
        if (!target) return;

        // IntersectionObserver の設定
        observerRef.current = new IntersectionObserver(async (entries) => {
            if (entries.some(entry => entry.isIntersecting) && !noMoreProfiles) {
                await distributeProfiles();
            }
        }, {
            rootMargin: `${window.innerHeight}px 0px`
        });

        observerRef.current.observe(target);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [distributeProfiles, noMoreProfiles]);

    // ルーティング
    const goEyesHome = () => router.push(`/eyeshome`);

    return (
        <>
            {noMoreProfiles && centerProfiles.length === 0 ? (
                <div className={styles.error_background}>
                    <p>まだ誰にもフォローされていません</p>

                    <button onClick={goEyesHome}>
                        <div></div>
                        <span>いざステージへ！</span>
                    </button>
                </div>
            ) : (
                <div className={styles.eyes_follower_list_wrapper} ref={centerColumnRef}>
                    {centerProfiles.map((profile) => (
                        <EyesFollowerProfileCard key={profile.accountId} profile={profile} />
                    ))}

                    {(noMoreProfiles === false) &&
                        <div className={styles.loader_background} ref={centerSentinelRef}>
                            <div className={styles.loader_background_upper}></div>

                            <div className={styles.loader}></div>

                            <div className={styles.loader_background_lower}></div>
                        </div>
                    }
                </div>
            )}
        </>
    );
};

export default EyesFollowerList;