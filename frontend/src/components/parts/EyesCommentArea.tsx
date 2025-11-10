//EyesCommentAreaコンポーネントを作成

import EyesCommentForm from 'src/components/parts/EyesCommentForm';
import EyesCommentCard from 'src/components/parts/EyesCommentCard';
import { EyesProps, EyesCommentApiProps, EyesCommentProps, convertEyesCommentProps } from "src/types";
import styles from 'src/styles/EyesCommentArea.module.css'
import React, { useState, useRef, useEffect, useCallback } from "react";


type MainEyesProps = {
    eyes: EyesProps | null | undefined;
};

// サーバーの代わりとなるサンプルデータ
const sampleEyesComments: (EyesCommentApiProps | null)[] = [
    {
        comment_id: "1",
        commentater: {
            account_id: "a",
            account_name: "Amane1",
            account_icon: "/samples/image1.jpg"
        },
        text: "This is a sample. It has no meaning.",
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
            account_id: "b",
            account_name: "Amane2",
            account_icon: "/samples/image2.jpg"
        },
        text: "This is a sample. It has no meaning.",
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
            account_id: "c",
            account_name: "Amane3",
            account_icon: "/samples/image3.jpg"
        },
        text: "This is a sample. It has no meaning.",
        created_at: "2025-02-11T12:00:00Z",
        good_number: 1,
        bad_number: 0,
        is_own: false,
        is_good_for_me: false,
        is_bad_for_me: false,
    },
    null,
];


const EyesCommentArea: React.FC<MainEyesProps> = ({ eyes }) => {
    // コメントの状態管理（センターカラムのみ使用）
    const [centerComments, setCenterComments] = useState<EyesCommentProps[]>([]);

    // カラムのDOM参照
    const centerColumnRef = useRef<HTMLDivElement | null>(null);

    // 初回ロードの状況
    const isFirstLoadCompleteRef = useRef(false);

    // IntersectionObserver用の監視要素
    const centerSentinelRef = useRef<HTMLDivElement | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    // サーバーのデータが尽きたことを示すフラグ
    const [noMoreComments, setNoMoreComments] = useState(false);
    const serverDataRef = useRef<(EyesCommentApiProps | null)[]>([...sampleEyesComments]);

    // サーバーからコメントを1件ずつ取得する関数
    const fetchComments = useCallback(async (): Promise<EyesCommentProps | null> => {
        if (noMoreComments) return null;
        const comment = serverDataRef.current.shift();
        if (comment === undefined) return null;
        if (comment === null) {
            setNoMoreComments(true);
            return null;
        }
        return convertEyesCommentProps(comment);
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
        if (!eyes) return;

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
    }, [distributeComments, noMoreComments, eyes]);

    //コメント欄の表示切替
    const [isCommentVisible, setIsCommentVisible] = useState(true);

    const handleToggle = () => {
        setIsCommentVisible((prev) => !prev);
    };

    return (
        <>
            <div className={styles.eyes_comment_area_wrapper} ref={centerColumnRef}>
                {(eyes !== undefined && eyes !== null) &&
                    <>
                        <EyesCommentForm
                            eyes={eyes}
                            isCommentVisible={isCommentVisible}
                            onToggle={handleToggle}
                        />

                        {isCommentVisible &&
                            <>
                                {centerComments.map((comment) => (
                                    <EyesCommentCard key={comment.commentId} comment={comment} />
                                ))}
                            </>
                        }

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

export default EyesCommentArea;