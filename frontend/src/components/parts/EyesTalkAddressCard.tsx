//EyesCommentCardコンポーネントを作成

import { EyesTalkAddressProps } from "src/types";
import styles from 'src/styles/EyesTalkAddressCard.module.css'
import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEllipsis } from "@fortawesome/free-solid-svg-icons"
import { faCircleDot } from "@fortawesome/free-regular-svg-icons"


type EyesTalkAddressCardProps = {
    address: EyesTalkAddressProps;
};


const TweetCommentCard: React.FC<EyesTalkAddressCardProps> = ({ address }) => {
    //ルーター
    const router = useRouter();
    const { id } = router.query; // URLのパスパラメータを取得

    //last_modefiedのフォーマット関数
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
            : `${postYear}`; // それ以外 → "年/月/日"
    };

    // スタイルの設定
    const isMyTurn = id === address.talkId;

    //カーソルを合わせた際の変更
    const [isHovered, setIsHovered] = useState(false);

    //画像のalt
    const iconAlt = `Icon Image: ${address.talkName}`;

    //URLパスパラメータ変更
    const changePass = () => {
        router.push(
            { pathname: '/eyesmessage/[id]', query: { id: address.talkId } },
            undefined,
            { shallow: true }
        );
    };

    return (
        <>
            <div
                className={styles.eyes_talk_address_card_wrapper}
                onClick={changePass}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    background: isHovered || isMyTurn ? "#f0f0f0" : "", 
                }}
            >
                <div className={styles.talk_icon_wrapper}>
                    <Image
                        className={styles.talk_icon}
                        src={address.talkIcon}
                        alt={iconAlt}
                        fill
                        priority={false}
                    />
                </div>

                <div className={styles.addresscard_rightside}>
                    <div className={styles.addresscard_rightside_upper}>
                        <div
                            className={styles.talk_name}
                            style={{
                                fontWeight: address.isRead ? "400" : "500",
                            }}
                        >
                            {address.talkName}
                        </div>

                        {isHovered ? (
                            <button className={styles.menu_btn}>
                                <span><FontAwesomeIcon icon={faEllipsis} /></span>
                            </button>
                        ) : (
                            <span
                                className={styles.last_modeified_time}
                                style={{
                                    fontWeight: address.isRead ? "400" : "500",
                                    color: address.isRead ? "#757575" : "#404040",
                                }}
                            >
                                {formatTime(address.lastModified)}
                            </span>
                        )}
                    </div>

                    <div className={styles.addresscard_rightside_lower}>
                        <div
                            className={styles.last_message}
                            style={{
                                fontWeight: address.isRead ? "400" : "500",
                                color: address.isRead ? "#646464" : "#404040",
                            }}
                        >
                            {address.lastMessage}
                        </div>

                        {!address.isRead && 
                            <div className={styles.read_mark}><FontAwesomeIcon icon={faCircleDot} /></div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
};

export default TweetCommentCard;