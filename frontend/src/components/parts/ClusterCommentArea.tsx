//ClusterCommentAreaコンポーネントを作成

import ClusterCommentCard from 'src/components/parts/ClusterCommentCard';
import { ClusterProps, ClusterCommentApiProps, ClusterCommentProps, convertClusterCommentProps } from "src/types";
import styles from 'src/styles/ClusterCommentArea.module.css'
import React, { useState, useRef, useEffect, useCallback } from "react";


type CurrentClusterProps = {
    cluster: ClusterProps | null | undefined;
};

// サーバーの代わりとなるサンプルデータ
const sampleClusterComments: (ClusterCommentApiProps | null)[] = [
    {
        comment_id: "1",
        commentater: {
            alias_id: "a",
            alias_name: "Amane1",
            alias_icon: "/samples/image1.jpg"
        },
        text: "This is a sample. It has no meaning.",
        images: [],
        created_at: "2025-01-01T12:00:00Z",
        good_number: 250,
        bad_number: 100,
        is_own: true,
        is_good_for_me: false,
        is_bad_for_me: false,
    },
    {
        comment_id: "2",
        commentater: {
            alias_id: "b",
            alias_name: "Amane2",
            alias_icon: "/samples/image2.jpg"
        },
        text: "これはサンプルです。特に意味はありません。",
        images: [],
        quote_comment: {
            comment_id: "1",
            commentater: {
                alias_id: "a",
                alias_name: "Amane3",
                alias_icon: "/samples/image3.jpg"
            },
            text: "This is a sample. It has no meaning.",
            images: [],
            created_at: "2025-01-01T12:00:00Z",
            good_number: 250,
            bad_number: 100,
            is_own: true,
            is_good_for_me: false,
            is_bad_for_me: false,
        },
        created_at: "2023-02-10T12:00:00Z",
        good_number: 35,
        bad_number: 25,
        is_own: false,
        is_good_for_me: true,
        is_bad_for_me: false,
    },
    {
        comment_id: "3",
        commentater: {
            alias_id: "c",
            alias_name: "Amane4",
            alias_icon: "/samples/image4.jpg"
        },
        text: "これはサンプルです。特に意味はありません。",
        images: [
            "/samples/image5.jpg"
        ],
        created_at: "2025-02-11T12:00:00Z",
        good_number: 1,
        bad_number: 0,
        is_own: false,
        is_good_for_me: false,
        is_bad_for_me: false,
    },
    null,
];


const ClusterCommentArea: React.FC<CurrentClusterProps> = ({ cluster }) => {
    // コメントの状態管理（センターカラムのみ使用）
    const [centerComments, setCenterComments] = useState<ClusterCommentProps[]>([]);

    // カラムのDOM参照
    const centerColumnRef = useRef<HTMLDivElement | null>(null);

    // 初回ロードの状況
    const isFirstLoadCompleteRef = useRef(false);

    // IntersectionObserver用の監視要素
    const centerSentinelRef = useRef<HTMLDivElement | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    // サーバーのデータが尽きたことを示すフラグ
    const [noMoreComments, setNoMoreComments] = useState(false);
    const serverDataRef = useRef<(ClusterCommentApiProps | null)[]>([...sampleClusterComments]);

    // サーバーからコメントを1件ずつ取得する関数
    const fetchComments = useCallback(async (): Promise<ClusterCommentProps | null> => {
        if (noMoreComments) return null;
        const comment = serverDataRef.current.shift();
        if (comment === undefined) return null;
        if (comment === null) {
            setNoMoreComments(true);
            return null;
        }
        return convertClusterCommentProps(comment);
    }, [noMoreComments]);

    // 指定したカラムの高さを取得する関数
    const getColumnHeight = (column: HTMLDivElement | null): number => {
        if (!column) return 0;
        const rect = column.getBoundingClientRect();
        const lastChild = column.lastElementChild as HTMLElement | null;
        return lastChild ? lastChild.getBoundingClientRect().bottom - rect.top : 0;
    };

    // コメントをセンターカラムに振り分ける関数
    const distributeComments = useCallback(async () => {
        if (noMoreComments) return;
        const comment = await fetchComments();
        if (!comment) return;
        setCenterComments(prev => [...prev, comment]);
    }, [fetchComments, noMoreComments]);

    // 初回ロードと追加コメントの管理（IntersectionObserver を使用）
    useEffect(() => {
        if (!cluster) return;

        // 初回ロード
        if (!isFirstLoadCompleteRef.current) {
            (async () => {
                document.body.style.overflow = "hidden";
                let centerHeight = 0;

                while (centerHeight < window.innerHeight * 3) {
                    if (noMoreComments) break; // コメントが尽きたらループ終了

                    await distributeComments();

                    // 少し待ってから高さを更新
                    await new Promise(resolve => setTimeout(resolve, 50));
                    centerHeight = getColumnHeight(centerColumnRef.current);
                }

                isFirstLoadCompleteRef.current = true;
                document.body.style.overflow = "";
            })();
        };

        if (noMoreComments) return;

        // 監視対象の要素を取得（センターカラムのみ）
        const target = centerSentinelRef.current;
        if (!target) return;

        // IntersectionObserver の設定
        observerRef.current = new IntersectionObserver(async (entries) => {
            if (entries.some(entry => entry.isIntersecting) && !noMoreComments) {
                await distributeComments();
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
    }, [distributeComments, noMoreComments, cluster]);

    return (
        <>
            <div className={styles.cluster_comment_area_wrapper} ref={centerColumnRef}>
                {(cluster !== undefined && cluster !== null) &&
                    <>
                        {centerComments.map((comment) => (
                            <ClusterCommentCard key={comment.commentId} comment={comment} />
                        ))}

                        {(noMoreComments === false) &&
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

export default ClusterCommentArea;