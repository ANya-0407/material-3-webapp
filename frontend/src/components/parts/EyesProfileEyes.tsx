//EyesProfileEyesコンポーネントを作成

import EyesCard from 'src/components/parts/EyesCard';
import { EyesProfilePageInfoProps, EyesApiProps, EyesProps, convertEyesProps } from "src/types";
import styles from 'src/styles/EyesProfileEyes.module.css';
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useIsWideScreen } from "src/utils/hooks";


type ProfileProps = {
    profile: EyesProfilePageInfoProps | null | undefined;
};

// サーバーの代わりとなるサンプルデータ
const sampleEyes: (EyesApiProps | null)[] = [
    {
        eyes_id: "1",
        poster: {
            account_id: "a",
            account_name: "Amane1",
            account_icon: "/samples/image1.jpg"
        },
        image: "/samples/image2.jpg",
        tag: "これはサンプルです。意味はありません。",
        hashtag: "#Sample",
        friends_post_ids: [
            "1",
            "4",
            "5"
        ],
        created_at: "2025-01-01T12:00:00Z",
        view_count: 95000,
        good_count: 25000,
        is_own: true,
        is_good_for_me: false,
        is_my_bookmark: false
    },
    {
        eyes_id: "2",
        poster: {
            account_id: "b",
            account_name: "Amane2",
            account_icon: "/samples/image3.jpg"
        },
        image: "/samples/image4.jpg",
        tag: "This is a sample. It has no meaning.",
        created_at: "2023-02-10T12:00:00Z",
        view_count: 365,
        good_count: 25,
        is_own: false,
        is_good_for_me: true,
        is_my_bookmark: false
    },
    {
        eyes_id: "3",
        poster: {
            account_id: "c",
            account_name: "Amane3",
            account_icon: "/samples/image5.jpg"
        },
        image: "/samples/image6.jpg",
        friends_post_ids: [
            "3",
            "4"
        ],
        created_at: "2025-02-11T12:00:00Z",
        view_count: 1200,
        good_count: 250,
        is_own: false,
        is_good_for_me: true,
        is_my_bookmark: true
    },
    {
        eyes_id: "1",
        poster: {
            account_id: "a",
            account_name: "Amane4",
            account_icon: "/samples/image7.jpg"
        },
        image: "/samples/image8.jpg",
        tag: "これはサンプルです。意味はありません。",
        hashtag: "#Sample",
        friends_post_ids: [
            "1",
            "4",
            "5"
        ],
        created_at: "2025-01-01T12:00:00Z",
        view_count: 95000,
        good_count: 25000,
        is_own: true,
        is_good_for_me: false,
        is_my_bookmark: false
    },
    {
        eyes_id: "2",
        poster: {
            account_id: "b",
            account_name: "Amane5",
            account_icon: "/samples/image9.jpg"
        },
        image: "/samples/image10.jpg",
        tag: "This is a sample. It has no meaning.",
        created_at: "2023-02-10T12:00:00Z",
        view_count: 365,
        good_count: 25,
        is_own: false,
        is_good_for_me: true,
        is_my_bookmark: false
    },
    {
        eyes_id: "3",
        poster: {
            account_id: "c",
            account_name: "Amane6",
            account_icon: "/samples/image11.jpg"
        },
        image: "/samples/image1.jpg",
        friends_post_ids: [
            "3",
            "4"
        ],
        created_at: "2025-02-11T12:00:00Z",
        view_count: 1200,
        good_count: 250,
        is_own: false,
        is_good_for_me: true,
        is_my_bookmark: true
    }, {
        eyes_id: "1",
        poster: {
            account_id: "a",
            account_name: "Amane1",
            account_icon: "/samples/image1.jpg"
        },
        image: "/samples/image2.jpg",
        tag: "これはサンプルです。意味はありません。",
        hashtag: "#Sample",
        friends_post_ids: [
            "1",
            "4",
            "5"
        ],
        created_at: "2025-01-01T12:00:00Z",
        view_count: 95000,
        good_count: 25000,
        is_own: true,
        is_good_for_me: false,
        is_my_bookmark: false
    },
    {
        eyes_id: "2",
        poster: {
            account_id: "b",
            account_name: "Amane2",
            account_icon: "/samples/image3.jpg"
        },
        image: "/samples/image4.jpg",
        tag: "This is a sample. It has no meaning.",
        created_at: "2023-02-10T12:00:00Z",
        view_count: 365,
        good_count: 25,
        is_own: false,
        is_good_for_me: true,
        is_my_bookmark: false
    },
    {
        eyes_id: "3",
        poster: {
            account_id: "c",
            account_name: "Amane3",
            account_icon: "/samples/image5.jpg"
        },
        image: "/samples/image6.jpg",
        friends_post_ids: [
            "3",
            "4"
        ],
        created_at: "2025-02-11T12:00:00Z",
        view_count: 1200,
        good_count: 250,
        is_own: false,
        is_good_for_me: true,
        is_my_bookmark: true
    },
    {
        eyes_id: "1",
        poster: {
            account_id: "a",
            account_name: "Amane4",
            account_icon: "/samples/image7.jpg"
        },
        image: "/samples/image8.jpg",
        tag: "これはサンプルです。意味はありません。",
        hashtag: "#Sample",
        friends_post_ids: [
            "1",
            "4",
            "5"
        ],
        created_at: "2025-01-01T12:00:00Z",
        view_count: 95000,
        good_count: 25000,
        is_own: true,
        is_good_for_me: false,
        is_my_bookmark: false
    }, {
        eyes_id: "2",
        poster: {
            account_id: "b",
            account_name: "Amane5",
            account_icon: "/samples/image9.jpg"
        },
        image: "/samples/image10.jpg",
        tag: "This is a sample. It has no meaning.",
        created_at: "2023-02-10T12:00:00Z",
        view_count: 365,
        good_count: 25,
        is_own: false,
        is_good_for_me: true,
        is_my_bookmark: false
    },
    {
        eyes_id: "3",
        poster: {
            account_id: "c",
            account_name: "Amane6",
            account_icon: "/samples/image11.jpg"
        },
        image: "/samples/image1.jpg",
        friends_post_ids: [
            "3",
            "4"
        ],
        created_at: "2025-02-11T12:00:00Z",
        view_count: 1200,
        good_count: 250,
        is_own: false,
        is_good_for_me: true,
        is_my_bookmark: true
    }, {
        eyes_id: "1",
        poster: {
            account_id: "a",
            account_name: "Amane1",
            account_icon: "/samples/image1.jpg"
        },
        image: "/samples/image2.jpg",
        tag: "これはサンプルです。意味はありません。",
        hashtag: "#Sample",
        friends_post_ids: [
            "1",
            "4",
            "5"
        ],
        created_at: "2025-01-01T12:00:00Z",
        view_count: 95000,
        good_count: 25000,
        is_own: true,
        is_good_for_me: false,
        is_my_bookmark: false
    },
    {
        eyes_id: "2",
        poster: {
            account_id: "b",
            account_name: "Amane2",
            account_icon: "/samples/image3.jpg"
        },
        image: "/samples/image4.jpg",
        tag: "This is a sample. It has no meaning.",
        created_at: "2023-02-10T12:00:00Z",
        view_count: 365,
        good_count: 25,
        is_own: false,
        is_good_for_me: true,
        is_my_bookmark: false
    },
    {
        eyes_id: "3",
        poster: {
            account_id: "c",
            account_name: "Amane3",
            account_icon: "/samples/image5.jpg"
        },
        image: "/samples/image6.jpg",
        friends_post_ids: [
            "3",
            "4"
        ],
        created_at: "2025-02-11T12:00:00Z",
        view_count: 1200,
        good_count: 250,
        is_own: false,
        is_good_for_me: true,
        is_my_bookmark: true
    },
    {
        eyes_id: "1",
        poster: {
            account_id: "a",
            account_name: "Amane4",
            account_icon: "/samples/image7.jpg"
        },
        image: "/samples/image8.jpg",
        tag: "これはサンプルです。意味はありません。",
        hashtag: "#Sample",
        friends_post_ids: [
            "1",
            "4",
            "5"
        ],
        created_at: "2025-01-01T12:00:00Z",
        view_count: 95000,
        good_count: 25000,
        is_own: true,
        is_good_for_me: false,
        is_my_bookmark: false
    },
    {
        eyes_id: "2",
        poster: {
            account_id: "b",
            account_name: "Amane5",
            account_icon: "/samples/image9.jpg"
        },
        image: "/samples/image10.jpg",
        tag: "This is a sample. It has no meaning.",
        created_at: "2023-02-10T12:00:00Z",
        view_count: 365,
        good_count: 25,
        is_own: false,
        is_good_for_me: true,
        is_my_bookmark: false
    },
    {
        eyes_id: "3",
        poster: {
            account_id: "c",
            account_name: "Amane6",
            account_icon: "/samples/image11.jpg"
        },
        image: "/samples/image1.jpg",
        friends_post_ids: [
            "3",
            "4"
        ],
        created_at: "2025-02-11T12:00:00Z",
        view_count: 1200,
        good_count: 250,
        is_own: false,
        is_good_for_me: true,
        is_my_bookmark: true
    }, 
    null,
];


const EyesProfileTweet: React.FC<ProfileProps> = ({ profile }) => {
    //画面サイズの判定
    const isWideScreen = useIsWideScreen();

    // 投稿の状態管理（PC: 左右カラム, モバイル: センターカラム）
    const [leftPosts, setLeftPosts] = useState<EyesProps[]>([]);
    const [rightPosts, setRightPosts] = useState<EyesProps[]>([]);
    const [centerPosts, setCenterPosts] = useState<EyesProps[]>([]);

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
    const serverDataRef = useRef<(EyesApiProps | null)[]>([...sampleEyes]);

    // サーバーから投稿を1件ずつ取得する関数
    const fetchPosts = useCallback(async (): Promise<EyesProps | null> => {
        if (noMorePosts) return null;
        const post = serverDataRef.current.shift();
        if (post === undefined) return null;
        if (post === null) {
            setNoMorePosts(true);
            return null;
        }
        return convertEyesProps(post);
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
            {profile &&
                <>
                    {noMorePosts && (centerPosts.length === 0 && leftPosts.length === 0 && rightPosts.length === 0) ? (
                        <div className={styles.error_background}>
                            <p>まだ投稿はありません</p>
                        </div>
                    ) : (
                        <div className={styles.eyes_profile_eyes_wrapper}>
                            <>
                                {isWideScreen === null ? null : isWideScreen ? (
                                    <div className={styles.contents_layout_container_pc}>
                                        <div className={styles.contents_layout_left} ref={leftColumnRef}>
                                            {leftPosts.map((post) => (
                                                <EyesCard key={post.eyesId} eyes={post} />
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
                                                <EyesCard key={post.eyesId} eyes={post} />
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
                                                <EyesCard key={post.eyesId} eyes={post} />
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
                            </>
                        </div>
                    )}
                </>
            }
        </>
    );
};

export default EyesProfileTweet;

