//ClusterSearchClusterコンポーネントを作成

import ClusterCard from 'src/components/parts/ClusterCard';
import { ClusterApiProps, ClusterProps, convertClusterProps } from "src/types";
import styles from 'src/styles/ClusterSearchCluster.module.css'
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useIsWideScreen } from "src/utils/hooks";


// サーバーの代わりとなるサンプルデータ
const sampleCluster: (ClusterApiProps | null)[] = [
    {
        cluster_id: "1",
        cluster_name: "Group1",
        header_image: "/samples/image1.jpg",
        cluster_explanation: "『Neverness to Everness』（NTE）はHotta Studioが自主開発した超現実アーバンオープンワールドRPGです。 Discord：https://discord.gg/ntejp YouTube：https://youtube.com/@NevernesstoEvernessJP",
        creator: {
            alias_id: "a",
            alias_name: "Amane1",
            alias_icon: "/samples/image2.jpg"
        },
        created_at: "2025-01-01T12:00:00Z",
        participants_number: 19,
        is_participating: true,
    },
    {
        cluster_id: "2",
        cluster_name: "Group2",
        header_image: "/samples/image3.jpg",
        cluster_explanation: "『Neverness to Everness』（NTE）はHotta Studioが自主開発した超現実アーバンオープンワールドRPGです。 Discord：https://discord.gg/ntejp YouTube：https://youtube.com/@NevernesstoEvernessJP",
        creator: {
            alias_id: "a",
            alias_name: "Amane2",
            alias_icon: "/samples/image4.jpg"
        },
        created_at: "2025-01-01T12:00:00Z",
        participants_number: 193,
        is_participating: false,
    },
    {
        cluster_id: "3",
        cluster_name: "Group3",
        header_image: "/samples/image5.jpg",
        cluster_explanation: "『Neverness to Everness』（NTE）はHotta Studioが自主開発した超現実アーバンオープンワールドRPGです。 Discord：https://discord.gg/ntejp YouTube：https://youtube.com/@NevernesstoEvernessJP",
        creator: {
            alias_id: "a",
            alias_name: "Amane3",
            alias_icon: "/samples/image6.jpg"
        },
        created_at: "2025-01-01T12:00:00Z",
        participants_number: 1012,
        is_participating: false,
    },
    {
        cluster_id: "4",
        cluster_name: "Group4",
        header_image: "/samples/image7.jpg",
        cluster_explanation: "『Neverness to Everness』（NTE）はHotta Studioが自主開発した超現実アーバンオープンワールドRPGです。 Discord：https://discord.gg/ntejp YouTube：https://youtube.com/@NevernesstoEvernessJP",
        creator: {
            alias_id: "a",
            alias_name: "Amane4",
            alias_icon: "/samples/image8.jpg"
        },
        created_at: "2025-01-01T12:00:00Z",
        participants_number: 19,
        is_participating: false,
    },
    null
]


const ClusterSearchCluster: React.FC = () => {
    //画面サイズの判定
    const isWideScreen = useIsWideScreen();

    // 投稿の状態管理（PC: 左右カラム, モバイル: センターカラム）
    const [leftPosts, setLeftPosts] = useState<ClusterProps[]>([]);
    const [rightPosts, setRightPosts] = useState<ClusterProps[]>([]);
    const [centerPosts, setCenterPosts] = useState<ClusterProps[]>([]);

    // 各カラムのDOM参照
    const leftColumnRef = useRef<HTMLDivElement | null>(null);
    const rightColumnRef = useRef<HTMLDivElement | null>(null);
    const centerColumnRef = useRef<HTMLDivElement | null>(null);

    // 初回ロードの状況
    const isFirstLoadCompleteRef = useRef(false);

    //IntersectionObserver用の監視要素
    const leftSentinelRef = useRef<HTMLDivElement | null>(null);
    const rightSentinelRef = useRef<HTMLDivElement | null>(null);
    const centerSentinelRef = useRef<HTMLDivElement | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    //サーバーのデータが尽きたことを示すフラグ
    const [noMorePosts, setNoMorePosts] = useState(false);
    const serverDataRef = useRef<(ClusterApiProps | null)[]>([...sampleCluster]);

    // サーバーから投稿を1件ずつ取得する関数
    const fetchPosts = useCallback(async (): Promise<ClusterProps | null> => {
        if (noMorePosts) return null;
        const post = serverDataRef.current.shift();
        if (post === undefined) return null;
        if (post === null) {
            setNoMorePosts(true);
            return null;
        }
        return convertClusterProps(post);
    }, [noMorePosts]);

    // 指定したカラムの高さを取得する関数
    const getColumnHeight = (column: HTMLDivElement | null): number => {
        if (!column) return 0;
        const rect = column.getBoundingClientRect();
        const lastChild = column.lastElementChild as HTMLElement | null;
        return lastChild ? lastChild.getBoundingClientRect().bottom - rect.top : 0;
    };

    // PC用の投稿をカラムに振り分ける関数
    const distributePostsPC = useCallback(async () => {
        if (noMorePosts) return;
        const leftHeight = getColumnHeight(leftColumnRef.current);
        const rightHeight = getColumnHeight(rightColumnRef.current);
        const post = await fetchPosts();
        if (!post) return;

        if (leftHeight <= rightHeight) {
            setLeftPosts(prev => [...prev, post]);
        } else {
            setRightPosts(prev => [...prev, post]);
        }
    }, [fetchPosts, noMorePosts]);

    // モバイル用の投稿をカラムに振り分ける関数
    const distributePostsMobile = useCallback(async () => {
        if (noMorePosts) return;
        const post = await fetchPosts();
        if (!post) return;

        setCenterPosts(prev => [...prev, post]);
    }, [fetchPosts, noMorePosts]);

    // 初回ロードと追加投稿の管理（IntersectionObserver を使用）
    useEffect(() => {
        if (isWideScreen === null) return;

        // 初回ロード
        if (!isFirstLoadCompleteRef.current) {
            (async () => {
                document.body.style.overflow = "hidden";

                if (isWideScreen) {
                    let leftHeight = 0;
                    let rightHeight = 0;

                    while (leftHeight < window.innerHeight * 3 || rightHeight < window.innerHeight * 3) {
                        if (noMorePosts) break; // 投稿が尽きたらループ終了

                        await distributePostsPC();

                        // 少し待ってから高さを更新
                        await new Promise(resolve => setTimeout(resolve, 50));
                        leftHeight = getColumnHeight(leftColumnRef.current);
                        rightHeight = getColumnHeight(rightColumnRef.current);
                    }
                } else {
                    let centerHeight = 0;

                    while (centerHeight < window.innerHeight * 3) {
                        if (noMorePosts) break; // 投稿が尽きたらループ終了

                        await distributePostsMobile();

                        // 少し待ってから高さを更新
                        await new Promise(resolve => setTimeout(resolve, 50));
                        centerHeight = getColumnHeight(centerColumnRef.current);
                    }
                }

                isFirstLoadCompleteRef.current = true;
                document.body.style.overflow = "";
            })();
        };

        if (noMorePosts) return;

        // 監視対象の要素を取得（PC: 左右のセンチネル, モバイル: 中央のセンチネル）
        const targets = isWideScreen
            ? [leftSentinelRef.current, rightSentinelRef.current]
            : [centerSentinelRef.current];

        // いずれのターゲットも存在しない場合は終了
        if (!targets.some(target => target !== null)) return;

        // IntersectionObserver の設定
        observerRef.current = new IntersectionObserver(async (entries) => {
            if (entries.some(entry => entry.isIntersecting) && !noMorePosts) {
                if (isWideScreen) {
                    await distributePostsPC();
                } else {
                    await distributePostsMobile();
                }
            }
        }, {
            rootMargin: `${window.innerHeight}px 0px`
        });

        // 各ターゲットを監視
        targets.forEach(target => {
            if (target) observerRef.current!.observe(target);
        });

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [distributePostsPC, distributePostsMobile, isWideScreen, noMorePosts]);

    return (
        <>
            <div className={styles.cluster_search_cluster_wrapper}>
                {isWideScreen === null ? null : isWideScreen ? (
                    <div className={styles.contents_layout_container_pc}>
                        <div className={styles.contents_layout_left} ref={leftColumnRef}>
                            {leftPosts.map((post) => (
                                <ClusterCard key={post.clusterId} cluster={post} />
                            ))}

                            {(noMorePosts === false) &&
                                <div className={styles.loader_background} ref={leftSentinelRef}>
                                    <div className={styles.loader_background_upper}></div>

                                    <div className={styles.loader}></div>

                                    <div className={styles.loader_background_lower}></div>
                                </div>
                            }
                        </div>

                        <div className={styles.contents_layout_right} ref={rightColumnRef}>
                            {rightPosts.map((post) => (
                                <ClusterCard key={post.clusterId} cluster={post} />
                            ))}

                            {(noMorePosts === false) &&
                                <div className={styles.loader_background} ref={rightSentinelRef}>
                                    <div className={styles.loader_background_upper}></div>

                                    <div className={styles.loader}></div>

                                    <div className={styles.loader_background_lower}></div>
                                </div>
                            }
                        </div>
                    </div>
                ) : (
                    <div className={styles.contents_layout_container_mobile}>
                        <div className={styles.contents_layout_center} ref={centerColumnRef}>
                            {centerPosts.map((post) => (
                                <ClusterCard key={post.clusterId} cluster={post} />
                            ))}

                            {(noMorePosts === false) &&
                                <div className={styles.loader_background} ref={centerSentinelRef}>
                                    <div className={styles.loader_background_upper}></div>

                                    <div className={styles.loader}></div>

                                    <div className={styles.loader_background_lower}></div>
                                </div>
                            }
                        </div>
                    </div>
                )}
            </div>
        </>
    )
};

export default ClusterSearchCluster;