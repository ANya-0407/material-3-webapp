//RelatedEyesコンポーネントを作成

import EyesCard from 'src/components/parts/EyesCard';
import { EyesApiProps, EyesProps, convertEyesProps } from "src/types";
import styles from 'src/styles/RelatedEyes.module.css';
import React, { useState, useRef, useEffect, useCallback } from "react";


type MainEyesProps = {
    eyes: EyesProps | null | undefined;
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


const RelatedEyes: React.FC<MainEyesProps> = ({ eyes }) => {
    // 投稿の状態管理（センターカラムのみ使用）
    const [centerPosts, setCenterPosts] = useState<EyesProps[]>([]);

    // カラムのDOM参照
    const centerColumnRef = useRef<HTMLDivElement | null>(null);

    // 初回ロードの状況
    const isFirstLoadCompleteRef = useRef(false);

    // IntersectionObserver用の監視要素
    const centerSentinelRef = useRef<HTMLDivElement | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    // サーバーのデータが尽きたことを示すフラグ
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

    // 投稿をセンターカラムに振り分ける関数
    const distributePosts = useCallback(async () => {
        if (noMorePosts) return;
        const post = await fetchPosts();
        if (!post) return;
        setCenterPosts(prev => [...prev, post]);
    }, [fetchPosts, noMorePosts]);

    // 初回ロードと追加投稿の管理（IntersectionObserver を使用）
    useEffect(() => {
        if (!eyes) return;

        // 初回ロード
        if (!isFirstLoadCompleteRef.current) {
            (async () => {
                document.body.style.overflow = "hidden";
                let centerHeight = 0;

                while (centerHeight < window.innerHeight * 3) {
                    if (noMorePosts) break; // 投稿が尽きたらループ終了

                    await distributePosts();

                    // 少し待ってから高さを更新
                    await new Promise(resolve => setTimeout(resolve, 50));
                    centerHeight = getColumnHeight(centerColumnRef.current);
                }

                isFirstLoadCompleteRef.current = true;
                document.body.style.overflow = "";
            })();
        };

        if (noMorePosts) return;

        // 監視対象の要素を取得（センターカラムのみ）
        const target = centerSentinelRef.current;
        if (!target) return;

        // IntersectionObserver の設定
        observerRef.current = new IntersectionObserver(async (entries) => {
            if (entries.some(entry => entry.isIntersecting) && !noMorePosts) {
                await distributePosts();
            }
        }, {
            rootMargin: `${window.innerHeight}px 0px`
        });

        // ターゲットを監視
        observerRef.current.observe(target);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [distributePosts, noMorePosts, eyes]);


    return (
        <>
            <div className={styles.related_eyes_wrapper} ref={centerColumnRef}>
                {(eyes !== undefined && eyes !== null) &&
                    <>
                        <span className={styles.title}>Related</span>

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
                    </>
                }
            </div>
        </>
    )
};

export default RelatedEyes;