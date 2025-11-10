//EyesCardコンポーネントを作成

import { EyesProps } from "src/types";
import styles from 'src/styles/EyesCard.module.css'
import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperclip, faEllipsis, faHeart as faHeartSolid, faBookmark as faBookmarkSolid } from "@fortawesome/free-solid-svg-icons"
import { faEye, faHeart as faHeartRegular, faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons"


type EyesCardProps = {
    eyes: EyesProps;
};

// 画像の自然サイズを取得
const loadImageSize = (url: string): Promise<{ w: number; h: number }> => {
    return new Promise((resolve, reject) => {
        if (typeof window === "undefined") {
            reject(new Error("no-window"));
            return;
        }
        const img = new window.Image();
        img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
        img.onerror = reject;
        img.src = url;
    });
};


const EyesCard: React.FC<EyesCardProps> = ({ eyes }) => {
    //ルーター
    const router = useRouter();

    // タグのアニメーション用
    const tagRef = useRef<HTMLDivElement | null>(null);
    const tagTextRef = useRef<HTMLDivElement | null>(null);

    // 画像URL
    const imgSrcRef = useRef<string | null>(null);

    // 画像の自然比（intrinsic）
    const [imgRatio, setImgRatio] = useState<{ w: number; h: number } | null>(null);

    // URLから自然比を取得
    useEffect(() => {
        const src = eyes.image; 
        imgSrcRef.current = src;
        setImgRatio(null);

        let cancelled = false;
        (async () => {
            try {
                const { w, h } = await loadImageSize(src);
                if (cancelled) return;
                // レース対策：最新URLでなければ破棄
                if (imgSrcRef.current !== src) return;
                setImgRatio({ w, h });
            } catch {
                setImgRatio(null);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [eyes.image]);

    // eyes_tagのアニメーション制御
    useLayoutEffect(() => {
        if (!tagRef.current || !tagTextRef.current) return;
        const tag = tagRef.current;
        const text = tagTextRef.current;

        const applyScrolling = () => {
            if (text.scrollWidth > tag.clientWidth) {
                const speed = text.scrollWidth * 0.01; // スクロール速度の計算
                text.style.setProperty("--scroll-speed", `${speed}s`);
                text.style.setProperty("--scroll-width", `-${text.scrollWidth - tag.clientWidth + 100}px`);
                text.classList.add(styles.scrolling);
            } else {
                text.classList.remove(styles.scrolling);
            }
        };

        // 初回適用
        applyScrolling();

        // ResizeObserverを使って、タグのサイズ変化を監視する
        const ro = new ResizeObserver(() => applyScrolling());
        ro.observe(tag);

        //ウィンドウリサイズにも対応
        const onResize = () => applyScrolling();
        window.addEventListener('resize', onResize); 

        return () => { ro.disconnect(); window.removeEventListener('resize', onResize); };
    }, []);

    //createdAtのフォーマット関数
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

    //viewCountおよびgoodCountのフォーマット関数
    const formatCount = (num: number): string => {
        if (num < 1000) {
            return num.toString();
        } else if (num < 1000000) {
            return (Math.round(num / 100) / 10).toFixed(1) + "k"; // 小数第1位まで表示
        } else {
            return (Math.round(num / 100000) / 10).toFixed(1) + "m"; // 小数第1位まで表示
        }
    };

    //画像のalt
    const iconAlt = `Icon Image: ${eyes.poster.accountName}`;
    const imageAlt = eyes.tag && eyes.tag.trim().length > 0
        ? `Post Image: ${eyes.tag}`
        : `Post Image by ${eyes.poster.accountName}`;

    // ルーティング
    const goEyesComment = () => {
        router.push(
            { pathname: '/eyescomment/[id]', query: { id: eyes.eyesId } },
        );
    };
    const goEyesProfile = () => {
        router.push(
            { pathname: '/eyesprofile/[id]', query: { id: eyes.poster.accountId } },
        );
    };

    return (
        <>
            <div className={styles.eyes_card_background}>
                <div className={styles.eyes_background_upper}>
                    <div className={styles.account_icon_wrapper} onClick={goEyesProfile}>
                        <Image
                            className={styles.account_icon}
                            src={eyes.poster.accountIcon}
                            alt={iconAlt}
                            fill
                            priority={false}
                        />
                    </div>

                    <button className={styles.account_name} onClick={goEyesProfile}>
                        {eyes.poster.accountName}
                    </button>

                    <span className={styles.created_at}>
                        {formatTime(eyes.createdAt)}
                    </span>
                </div>

                {eyes.tag && 
                    <div className={styles.eyes_tag_border}>
                        <div className={styles.eyes_tag} ref={tagRef}>
                            <div className={styles.eyes_tag_text} ref={tagTextRef}>
                                <span><FontAwesomeIcon icon={faPaperclip} /></span>
                                <div>{eyes.tag}</div>
                            </div>
                        </div>
                    </div>
                }

                {imgRatio ? (
                    <div className={styles.eyes_image_wrapper} onClick={goEyesComment}>
                        <Image
                            className={styles.eyes_image}
                            src={eyes.image}
                            alt={imageAlt}
                            // intrinsic（自然比）— CLS回避
                            width={imgRatio.w}
                            height={imgRatio.h}
                            // 表示サイズ：横はCSSにフィット（100%）、縦は自然比で自動
                            style={{ width: "100%", height: "auto" }}
                            priority={false}
                        />
                    </div>
                ) : (
                    <div
                        aria-hidden="true"
                        style={{
                            width: "100%",
                            aspectRatio: "1 / 1",
                            background:
                                "linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 37%, #f0f0f0 63%)",
                            backgroundSize: "400% 100%",
                            animation: "loading 1.2s ease-in-out infinite",
                        }}
                    />
                )}

                <button className={styles.friends_post_prev_btn}>
                    <div className={styles.friends_prev_account_icon_wrapper}>
                        <Image
                            className={styles.friends_prev_account_icon}
                            src={eyes.poster.accountIcon}
                            alt={iconAlt}
                            fill
                            priority={false}
                        />
                    </div>
                </button>

                <button className={styles.friends_post_next_btn}>
                    <div className={styles.friends_next_account_icon_wrapper}>
                        <Image
                            className={styles.friends_next_account_icon}
                            src={eyes.poster.accountIcon}
                            alt={iconAlt}
                            fill
                            priority={false}
                        />
                    </div>
                </button>

                <div className={styles.eyes_background_lower}>
                    <div className={styles.hashtag_container}>
                        {eyes.hashtag !== undefined &&
                            <button className={styles.hashtag}>{eyes.hashtag}</button>
                        }
                    </div>

                    <div className={styles.eyes_view_count}>
                        <p><FontAwesomeIcon icon={faEye} /></p>

                        <span>{formatCount(eyes.viewCount)}</span>
                    </div>

                    <div className={styles.eyes_btn_container}>
                        {eyes.isOwn === true ? (
                            <button className={styles.menu_btn}><FontAwesomeIcon icon={faEllipsis} /></button>
                        ) : (
                            <button className={styles.menu_btn}><FontAwesomeIcon icon={faEllipsis} /></button>
                        )}

                        {eyes.isMyBookmark === true ? (
                            <button className={styles.bookmark_btn}><FontAwesomeIcon icon={faBookmarkSolid} /></button>
                        ) : (
                            <button className={styles.bookmark_btn}><FontAwesomeIcon icon={faBookmarkRegular} /></button>
                        )}

                        <button className={styles.good_btn}>
                            {eyes.isGoodForMe === true ? (
                                <p><FontAwesomeIcon icon={faHeartSolid} /></p>
                            ) : (
                                <p><FontAwesomeIcon icon={faHeartRegular} /></p>
                            )}

                            <span>{formatCount(eyes.goodCount)}</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
};

export default EyesCard;