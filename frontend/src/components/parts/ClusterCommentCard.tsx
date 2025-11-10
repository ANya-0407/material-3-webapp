//ClusterCommentCardコンポーネントを作成

import ClusterReplyCommentCard from 'src/components/parts/ClusterReplyCommentCard';
import { ClusterCommentApiProps, ClusterCommentProps, convertClusterCommentProps } from "src/types";
import styles from 'src/styles/ClusterCommentCard.module.css'
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useIsWideScreen } from "src/utils/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEllipsis, faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons"
import { faThumbsUp, faThumbsDown, faComment } from "@fortawesome/free-regular-svg-icons"


type ClusterCommentCardProps = {
    comment: ClusterCommentProps;
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
        text: "これはサンプルです。特に意味はありません。",
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
        text: "This is a sample. It has no meaning.",
        images: [
            "/samples/image2.jpg",
            "/samples/image3.jpg",
            "/samples/image4.jpg",
            "/samples/image5.jpg"
        ],
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
            alias_name: "Amane3",
            alias_icon: "/samples/image6.jpg"
        },
        text: "This is a sample. It has no meaning.",
        images: [],
        created_at: "2025-02-11T12:00:00Z",
        good_number: 1,
        bad_number: 0,
        is_own: false,
        is_good_for_me: false,
        is_bad_for_me: false,
    },
    null,
];


const ClusterCommentCard: React.FC<ClusterCommentCardProps> = ({ comment }) => {
    //ルーター
    const router = useRouter();

    //画面サイズの判定
    const isWideScreen = useIsWideScreen();

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
    }, [distributeComments, noMoreComments]);

    //generationTimeのフォーマット関数
    const formatTime = (time: Date): string => {
        const postDate = new Date(time); // UTCからローカル時間に変換
        const now = new Date();

        const diffMs = now.getTime() - postDate.getTime();
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffMinutes < 60) {
            return `${diffMinutes}m`; // 1時間以内 → 分で表示
        }

        if (diffHours < 24) {
            return `${diffHours}h`; // 24時間以内 → 時間で表示
        }

        const postYear = postDate.getFullYear();
        const nowYear = now.getFullYear();

        return postYear === nowYear
            ? `${postDate.getMonth() + 1}/${postDate.getDate()}` // 同じ年 → "月/日"
            : `${postYear}/${postDate.getMonth() + 1}/${postDate.getDate()}`; // それ以外 → "年/月/日"
    };

    //viewTimeおよびgoodNumberのフォーマット関数
    const formatNumber = (num: number): string => {
        if (num < 1000) {
            return num.toString();
        } else if (num < 1000000) {
            return (Math.round(num / 100) / 10).toFixed(1) + "k"; // 小数第1位まで表示
        } else {
            return (Math.round(num / 100000) / 10).toFixed(1) + "m"; // 小数第1位まで表示
        }
    };

    // 評価バーの計算
    const total = comment.goodNumber + comment.badNumber;
    const goodPercentage = total === 0 ? 100 : (comment.goodNumber / total) * 100;

    //返信フォームの表示切替
    const [isReplyFormVisible, setIsReplyFormVisible] = useState(false);

    const handleToggleReplyForm = () => {
        setIsReplyFormVisible((prev) => !prev);
    };

    //返信欄の表示切替
    const [isReplyVisible, setIsReplyVisible] = useState(false);

    const handleToggleReply = () => {
        setIsReplyVisible((prev) => !prev);
    };

    //画像のalt
    const iconAlt = `Icon Image: ${comment.commentater.aliasName}`;

    //ルーティング
    const goVoicesProfile = () => {
        router.push(`/voicesprofile/${comment.commentater.aliasId}`);
    };

    return (
        <>
            <div className={styles.cluster_comment_card_wrapper} ref={centerColumnRef} >
                <div className={styles.comment_background}>
                    <div className={styles.comment_background_left}>
                        <div className={styles.alias_icon_wrapper} onClick={goVoicesProfile}>
                            <Image
                                className={styles.alias_icon}
                                src={comment.commentater.aliasIcon}
                                alt={iconAlt}
                                fill
                                priority={false}
                            />
                        </div>
                    </div>

                    <div className={styles.comment_background_right}>
                        <div className={styles.comment_background_upper}>
                            <button className={styles.alias_name} onClick={goVoicesProfile}>
                                {comment.commentater.aliasName}
                            </button>

                            <div className={styles.generation_time}>
                                {formatTime(comment.createdAt)}
                            </div>
                        </div>

                        {comment.quoteComment &&
                            <div className={styles.quote_comment_container}>
                                <div className={styles.quote_comment_commentater}>
                                    {comment.quoteComment.commentater.aliasName}
                                </div>

                                {comment.quoteComment.text &&
                                    <div className={styles.quote_comment_text}>
                                        {comment.quoteComment.text}
                                    </div>
                                }

                                {comment.quoteComment.images &&
                                    <span>
                                        [写真]
                                    </span>
                                }
                            </div>
                        }

                        {comment.text &&
                            <div className={styles.comment_text}>
                                {comment.text}
                            </div>
                        }

                        {isWideScreen ? (
                            <div className={styles.image_container_pc}>
                                {comment.images.length >= 1 &&
                                    <img src={comment.images[0]} alt={`Comment Image 1: ${comment.text}`}></img>
                                }

                                {comment.images.length >= 2 &&
                                    <img src={comment.images[1]} alt={`Comment Image 1: ${comment.text}`}></img>
                                }

                                {comment.images.length >= 3 &&
                                    <img src={comment.images[2]} alt={`Comment Image 1: ${comment.text}`}></img>
                                }

                                {comment.images.length >= 4 &&
                                    <img src={comment.images[3]} alt={`Comment Image 1: ${comment.text}`}></img>
                                }
                            </div>
                        ) : (
                            <div className={styles.image_container_mobile}>
                                {comment.images.length === 1 &&
                                    <div className={styles.comment_image_layout1}>
                                        <img src={comment.images[0]} alt={`Comment Image 1: ${comment.text}`}></img>
                                    </div>
                                }

                                {comment.images.length === 2 &&
                                    <div className={styles.comment_image_layout2}>
                                        <img src={comment.images[0]} alt={`Comment Image 1: ${comment.text}`}></img>

                                        <img src={comment.images[1]} alt={`Comment Image 2: ${comment.text}`}></img>
                                    </div>
                                }

                                {comment.images.length === 3 &&
                                    <div className={styles.comment_image_layout3}>
                                        <div className={styles.comment_image_section1}>
                                            <img src={comment.images[0]} alt={`Comment Image 1: ${comment.text}`}></img>
                                        </div>

                                        <div className={styles.comment_image_section2}>
                                            <img src={comment.images[1]} alt={`Comment Image 2: ${comment.text}`}></img>

                                            <img src={comment.images[2]} alt={`Comment Image 3: ${comment.text}`}></img>
                                        </div>
                                    </div>
                                }

                                {comment.images.length >= 4 &&
                                    <div className={styles.comment_image_layout4}>
                                        <div className={styles.comment_image_section1}>
                                            <img src={comment.images[0]} alt={`Comment Image 1: ${comment.text}`}></img>

                                            <img src={comment.images[1]} alt={`Comment Image 2: ${comment.text}`}></img>
                                        </div>

                                        <div className={styles.comment_image_section2}>
                                            <img src={comment.images[2]} alt={`Comment Image 3: ${comment.text}`}></img>

                                            <img src={comment.images[3]} alt={`Comment Image 4: ${comment.text}`}></img>
                                        </div>
                                    </div>
                                }
                            </div>
                        )}

                        <div className={styles.comment_lower}>
                            <button id="good_btn" className={styles.good_btn}><FontAwesomeIcon icon={faThumbsUp} /></button>

                            <label htmlFor="good_btn" className={styles.good_number}>{formatNumber(comment.goodNumber)}</label>

                            <div className={styles.evaluation_bar_background}>
                                <div className={styles.evaluation_bar} style={{ width: `${goodPercentage}%` }} />
                            </div>

                            <button className={styles.bad_btn}><FontAwesomeIcon icon={faThumbsDown} /></button>

                            <button className={styles.menu_btn}><FontAwesomeIcon icon={faEllipsis} /></button>

                            <button className={styles.reply_placeholder_isdisplay_btn} onClick={handleToggleReplyForm}><FontAwesomeIcon icon={faComment} /></button>
                        </div>
                    </div>
                </div>

                {isReplyFormVisible && 
                    <div className={styles.reply_placeholder_container}>
                        <textarea className={styles.text_placeholder} placeholder="コメントに返信" maxLength={300}></textarea>

                        <span></span>

                        <button className={styles.send_btn}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 664 663">
                                <path
                                    fill="none"
                                    d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
                                ></path>
                                <path
                                    stroke-linejoin="round"
                                    stroke-linecap="round"
                                    stroke-width="33.67"
                                    stroke="#6c6c6c"
                                    d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
                                ></path>
                            </svg>
                        </button>
                    </div>
                }

                {(centerComments.length > 0) &&
                    <>
                        {isReplyVisible ? (
                            <div className={styles.reply_wrapper}>
                                <div className={styles.reply_bar}>
                                    <span></span>
                                </div>

                            <button className={styles.reply_isdisplay_btn} style={{ marginLeft: `9%` }} onClick={handleToggleReply}><FontAwesomeIcon icon={faChevronUp} /> 非表示</button>

                                {centerComments.map((comment) => (
                                    <ClusterReplyCommentCard key={comment.commentId} comment={comment} />
                                ))}

                                {(noMoreComments === false) &&
                                    <div className={styles.loader_background} ref={centerSentinelRef}>
                                        <div className={styles.loader_background_upper}></div>

                                        <div className={styles.loader}></div>

                                        <div className={styles.loader_background_lower}></div>
                                    </div>
                                }

                                <div style={{ marginBottom: `15px` }} />
                            </div>
                    ) : (
                            <>
                                <button className={styles.reply_isdisplay_btn} onClick={handleToggleReply}><FontAwesomeIcon icon={faChevronDown} /> {centerComments.length}件の返信</button>
                            </>
                        )}
                    </>
                }
            </div>
        </>
    )
};

export default ClusterCommentCard;