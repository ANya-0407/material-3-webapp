//VoicesCardコンポーネントを作成

import { VoicesProps } from "src/types";
import styles from 'src/styles/VoicesCard.module.css'
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEllipsis, faHeart } from "@fortawesome/free-solid-svg-icons"
import { faEye, faPenToSquare, faBookmark } from "@fortawesome/free-regular-svg-icons"


type VoicesCardProps = {
    voices: VoicesProps;
};

// 画像の自然サイズを取得（縦固定・横可変の算出で使用）
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


const VoicesCard: React.FC<VoicesCardProps> = ({ voices }) => {
    //ルーター
    const router = useRouter();

    // 画像サイズ計算用(一枚レイアウト用)
    const [imgRatio1, setImgRatio1] = useState<{ w: number; h: number } | null>(null);
    const firstImgSrcRef = useRef<string | null>(null);

    // 画像が1枚のときだけ自然比を取得
    useEffect(() => {
        if (voices.images.length !== 1) {
            setImgRatio1(null);
            firstImgSrcRef.current = null;
            return;
        }
        const src = voices.images[0];
        firstImgSrcRef.current = src;
        setImgRatio1(null);

        let cancelled = false;
        (async () => {
            try {
                const { w, h } = await loadImageSize(src);
                if (cancelled) return;
                if (firstImgSrcRef.current !== src) return; // レース対策
                setImgRatio1({ w, h });
            } catch {
                setImgRatio1(null);
            }
        })();

        return () => { cancelled = true; };
    }, [voices.images]);

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

    //引用ボタン(VoicesFormを開く)
    const openQuoteForm = () => {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('openVoicesForm', {
                detail: { quotedVoicesId: voices.voicesId }
            }));
        }
    };

    //画像のalt
    const iconAlt = `Icon Image: ${voices.poster.accountName}`;
    const imageAlt = voices.hashtag && voices.hashtag.trim().length > 0
        ? `Post Image: ${voices.hashtag}`
        : `Post Image by ${voices.poster.accountName}`;

    // ルーティング
    const goVoicesComment = () => {
        router.push(
            { pathname: '/voicescomment/[id]', query: { id: voices.voicesId } },
        );
    };
    const goVoicesProfile = () => {
        router.push(
            { pathname: '/voicesprofile/[id]', query: { id: voices.poster.accountId } },
        );
    };

    return (
        <>
            <div className={styles.voices_card_background}>
                <div className={styles.voices_background_upper}>
                    <div className={styles.account_icon_wrapper} onClick={goVoicesProfile}>
                        <Image
                            className={styles.account_icon}
                            src={voices.poster.accountIcon}
                            alt={iconAlt}
                            fill
                            priority={false}
                        />
                    </div>

                    <button className={styles.account_name} onClick={goVoicesProfile}>
                        {voices.poster.accountName}
                    </button>

                    <span className={styles.created_at}>
                        {formatTime(voices.createdAt)}
                    </span>
                </div>

                {voices.text &&
                    <div className={styles.voices_text}>
                        {voices.text}
                    </div>
                }

                {voices.text && (voices.hashtag && voices.images.length == 0 ?
                    <div style={{ marginBottom: '25px' }} /> :
                    <div style={{ marginBottom: '8px' }} /> )
                }

                {voices.images.length === 1 ? (
                    imgRatio1 ? (
                        <div className={styles.voices_image_layout1} onClick={goVoicesComment}>
                            <Image
                                className={styles.voices_image}
                                src={voices.images[0]}
                                alt={imageAlt}
                                width={imgRatio1.w}
                                height={imgRatio1.h}
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
                    )
                ) : voices.images.length === 2 ? (
                    <div className={styles.voices_image_layout2}>
                        <div className={styles.voices_image_wrapper} onClick={goVoicesComment}>
                            <Image
                                className={styles.voices_image}
                                src={voices.images[0]}
                                alt={imageAlt}
                                fill
                                style={{ objectFit: "cover", objectPosition: "center" }}
                                priority={false}
                            />
                        </div>

                        <div className={styles.voices_image_wrapper} onClick={goVoicesComment}>
                            <Image
                                className={styles.voices_image}
                                src={voices.images[1]}
                                alt={imageAlt}
                                fill
                                style={{ objectFit: "cover", objectPosition: "center" }}
                                priority={false}
                            />
                        </div>
                    </div>
                ) : voices.images.length === 3 ? (
                    <div className={styles.voices_image_layout3}>
                        <div className={styles.voices_image_section1}>
                            <div className={styles.voices_image_wrapper} onClick={goVoicesComment}>
                                <Image
                                    className={styles.voices_image}
                                    src={voices.images[0]}
                                    alt={imageAlt}
                                    fill
                                    style={{ objectFit: "cover", objectPosition: "center" }}
                                    priority={false}
                                />
                            </div>
                        </div>

                        <div className={styles.voices_image_section2}>
                            <div className={styles.voices_image_wrapper} onClick={goVoicesComment}>
                                <Image
                                    className={styles.voices_image}
                                    src={voices.images[1]}
                                    alt={imageAlt}
                                    fill
                                    style={{ objectFit: "cover", objectPosition: "center" }}
                                    priority={false}
                                />
                            </div>

                            <div className={styles.voices_image_wrapper} onClick={goVoicesComment}>
                                <Image
                                    className={styles.voices_image}
                                    src={voices.images[2]}
                                    alt={imageAlt}
                                    fill
                                    style={{ objectFit: "cover", objectPosition: "center" }}
                                    priority={false}
                                />
                            </div>
                        </div>
                    </div>
                ) : voices.images.length >= 4 ? (
                    <div className={styles.voices_image_layout4}>
                        <div className={styles.voices_image_section1}>
                            <div className={styles.voices_image_wrapper} onClick={goVoicesComment}>
                                <Image
                                    className={styles.voices_image}
                                    src={voices.images[0]}
                                    alt={imageAlt}
                                    fill
                                    style={{ objectFit: "cover", objectPosition: "center" }}
                                    priority={false}
                                />
                            </div>

                            <div className={styles.voices_image_wrapper} onClick={goVoicesComment}>
                                <Image
                                    className={styles.voices_image}
                                    src={voices.images[1]}
                                    alt={imageAlt}
                                    fill
                                    style={{ objectFit: "cover", objectPosition: "center" }}
                                    priority={false}
                                />
                            </div>
                        </div>

                        <div className={styles.voices_image_section2}>
                            <div className={styles.voices_image_wrapper} onClick={goVoicesComment}>
                                <Image
                                    className={styles.voices_image}
                                    src={voices.images[2]}
                                    alt={imageAlt}
                                    fill
                                    style={{ objectFit: "cover", objectPosition: "center" }}
                                    priority={false}
                                />
                            </div>

                            <div className={styles.voices_image_wrapper} onClick={goVoicesComment}>
                                <Image
                                    className={styles.voices_image}
                                    src={voices.images[3]}
                                    alt={imageAlt}
                                    fill
                                    style={{ objectFit: "cover", objectPosition: "center" }}
                                    priority={false}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <p></p>
                )}

                <div className={styles.voices_background_lower}>
                    {voices.hashtag !== undefined &&
                        <div className={styles.hashtag_container}>
                            <button className={styles.hashtag}>{voices.hashtag}</button>
                        </div>
                    }

                    <div className={styles.voices_viewtime}>
                        <p><FontAwesomeIcon icon={faEye} /></p>

                        <span>{formatCount(voices.viewCount)}</span>
                    </div>

                    <div className={styles.voices_btn_container}>
                        <button className={styles.menu_btn}><FontAwesomeIcon icon={faEllipsis} /></button>

                        <button className={styles.quote_btn} onClick={openQuoteForm}><FontAwesomeIcon icon={faPenToSquare} /></button>

                        <button className={styles.bookmark_btn}><FontAwesomeIcon icon={faBookmark} /></button>

                        <button className={styles.good_btn}>
                            <p><FontAwesomeIcon icon={faHeart} /></p>

                            <span>{formatCount(voices.goodCount)}</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
};

export default VoicesCard;