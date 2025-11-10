//EyesMyMessageCardコンポーネントを作成

import { EyesMessageProps } from "src/types";
import styles from 'src/styles/EyesMyMessageCard.module.css'
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye } from "@fortawesome/free-regular-svg-icons"


type EyesMyMessageCardProps = {
    message: EyesMessageProps;
};

// 画像の自然サイズを取得（縦固定・横可変の算出で使用）
const loadImageSize = (url: string): Promise<{ w: number; h: number }> =>
    new Promise((resolve, reject) => {
        if (typeof window === "undefined") return reject(new Error("no-window"));
        const img = new window.Image();
        img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
        img.onerror = reject;
        img.src = url;
    });


const MyMessageCard: React.FC<EyesMyMessageCardProps> = ({ message }) => {
    // 画像サイズ計算用(一枚レイアウト用)
    const [imgRatio1, setImgRatio1] = useState<{ w: number; h: number } | null>(null);
    const firstImgSrcRef = useRef<string | null>(null);

    // 画像が1枚のときだけ自然比を取得
    useEffect(() => {
        // 画像が1枚のときだけ自然比を取得し、幅100%・縦比維持で表示するための width/height を保持
        if (message.messageFiles.length !== 1) {
            setImgRatio1(null);
            firstImgSrcRef.current = null;
            return;
        }
        const src = message.messageFiles[0];
        firstImgSrcRef.current = src;
        setImgRatio1(null);

        let cancelled = false;
        (async () => {
            try {
                const { w, h } = await loadImageSize(src);
                if (cancelled) return;
                if (firstImgSrcRef.current !== src) return;
                setImgRatio1({ w, h });
            } catch {
                setImgRatio1(null);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [message.messageFiles]);

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

    //画像のalt
    const imageAlt1 = `Message Image 1: ${message.messageText ?? ""}`;
    const imageAlt2 = `Message Image 2: ${message.messageText ?? ""}`;
    const imageAlt3 = `Message Image 3: ${message.messageText ?? ""}`;
    const imageAlt4 = `Message Image 4: ${message.messageText ?? ""}`;

    return (
        <>
            <div className={styles.eyes_my_message_card_wrapper}>
                <div className={styles.message_rightside}>
                    <div className={styles.message_status}>
                        {message.isRead &&
                            <span className={styles.read_mark}>
                                <FontAwesomeIcon icon={faEye} />
                            </span>
                        }

                        <span className={styles.created_at}>
                            {formatTime(message.createdAt)}
                        </span>
                    </div>

                    <div className={styles.message_center_column}>
                        {(message.messageText || message.quoteMessage) &&
                            <div className={styles.message_text_container}>
                                {message.quoteMessage && 
                                    <div className={styles.quote_message_container}>
                                        <div className={styles.quote_message_sender}>
                                            {message.quoteMessage.sender.accountName}
                                        </div>

                                        {message.quoteMessage.messageText &&
                                            <div className={styles.quote_message_text}>
                                                {message.quoteMessage.messageText}
                                            </div>
                                        }

                                        {message.quoteMessage.messageFiles &&
                                            <span>
                                                [写真]
                                            </span>
                                        }
                                    </div>
                                }

                                {message.messageText &&
                                    <div className={styles.message_text}>
                                        {message.messageText}
                                    </div>
                                }
                            </div>
                        }

                        {message.messageFiles.length === 1 &&
                            <div className={styles.message_image_layout1}>
                                {imgRatio1 ? (
                                    <div className={styles.message_image_wrapper}>
                                        <Image
                                            src={message.messageFiles[0]}
                                            alt={imageAlt1}
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
                                )}
                            </div>
                        }

                        {message.messageFiles.length === 2 &&
                            <div className={styles.message_image_layout2}>
                                <div className={styles.message_image_wrapper}>
                                    <Image
                                        className={styles.message_image}
                                        src={message.messageFiles[0]}
                                        alt={imageAlt1}
                                        fill
                                        style={{ objectFit: "cover", objectPosition: "center" }}
                                        priority={false}
                                    />
                                </div>

                                <div className={styles.message_image_wrapper}>
                                    <Image
                                        className={styles.message_image}
                                        src={message.messageFiles[1]}
                                        alt={imageAlt2}
                                        fill
                                        style={{ objectFit: "cover", objectPosition: "center" }}
                                        priority={false}
                                    />
                                </div>
                            </div>
                        }

                        {message.messageFiles.length === 3 &&
                            <div className={styles.message_image_layout3}>
                                <div className={styles.message_image_section1}>
                                    <div className={styles.message_image_wrapper}>
                                        <Image
                                            className={styles.message_image}
                                            src={message.messageFiles[0]}
                                            alt={imageAlt1}
                                            fill
                                            style={{ objectFit: "cover", objectPosition: "center" }}
                                            priority={false}
                                        />
                                    </div>
                                </div>

                                <div className={styles.message_image_section2}>
                                    <div className={styles.message_image_wrapper}>
                                        <Image
                                            className={styles.message_image}
                                            src={message.messageFiles[1]}
                                            alt={imageAlt2}
                                            fill
                                            style={{ objectFit: "cover", objectPosition: "center" }}
                                            priority={false}
                                        />
                                    </div>

                                    <div className={styles.message_image_wrapper}>
                                        <Image
                                            className={styles.message_image}
                                            src={message.messageFiles[2]}
                                            alt={imageAlt3}
                                            fill
                                            style={{ objectFit: "cover", objectPosition: "center" }}
                                            priority={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        }

                        {message.messageFiles.length === 4 &&
                            <div className={styles.message_image_layout4}>
                                <div className={styles.message_image_section1}>
                                    <div className={styles.message_image_wrapper}>
                                        <Image
                                            className={styles.message_image}
                                            src={message.messageFiles[0]}
                                            alt={imageAlt1}
                                            fill
                                            style={{ objectFit: "cover", objectPosition: "center" }}
                                            priority={false}
                                        />
                                    </div>

                                    <div className={styles.message_image_wrapper}>
                                        <Image
                                            className={styles.message_image}
                                            src={message.messageFiles[1]}
                                            alt={imageAlt2}
                                            fill
                                            style={{ objectFit: "cover", objectPosition: "center" }}
                                            priority={false}
                                        />
                                    </div>
                                </div>

                                <div className={styles.message_image_section2}>
                                    <div className={styles.message_image_wrapper}>
                                        <Image
                                            className={styles.message_image}
                                            src={message.messageFiles[2]}
                                            alt={imageAlt3}
                                            fill
                                            style={{ objectFit: "cover", objectPosition: "center" }}
                                            priority={false}
                                        />
                                    </div>
                                    <div className={styles.message_image_wrapper}>
                                        <Image
                                            className={styles.message_image}
                                            src={message.messageFiles[3]}
                                            alt={imageAlt4}
                                            fill
                                            style={{ objectFit: "cover", objectPosition: "center" }}
                                            priority={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
};

export default MyMessageCard;