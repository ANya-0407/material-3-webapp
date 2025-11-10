//EyesReplyCommentCardコンポーネントを作成

import { EyesCommentProps } from "src/types";
import styles from 'src/styles/EyesReplyCommentCard.module.css'
import { useRouter } from "next/router";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-regular-svg-icons"


type EyesCommentCardProps = {
    comment: EyesCommentProps;
};


const EyesReplyCommentCard: React.FC<EyesCommentCardProps> = ({ comment }) => {
    //ルーター
    const router = useRouter();

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

    //画像のalt
    const iconAlt = `Icon Image: ${comment.commentater.accountName}`;

    //ルーティング
    const goEyesProfile = () => {
        router.push(`/eyesprofile/${comment.commentater.accountId}`);
    };

    return (
        <>
            <div className={styles.reply_comment_background}>
                <div className={styles.comment_background_left}>
                    <div className={styles.account_icon_wrapper} onClick={goEyesProfile}>
                        <Image
                            className={styles.account_icon}
                            src={comment.commentater.accountIcon}
                            alt={iconAlt}
                            fill
                            priority={false}
                        />
                    </div>
                </div>

                <div className={styles.comment_background_right}>
                    <div className={styles.comment_background_upper}>
                        <button className={styles.account_name} onClick={goEyesProfile}>
                            {comment.commentater.accountName}
                        </button>

                        <div className={styles.generation_time}>
                            {formatTime(comment.createdAt)}
                        </div>
                    </div>

                    <div className={styles.comment_text_container}>
                        {comment.text}
                    </div>

                    <div className={styles.comment_lower}>
                        <button id="good_btn" className={styles.good_btn}><FontAwesomeIcon icon={faThumbsUp} /></button>

                        <label htmlFor="good_btn" className={styles.good_number}>{formatNumber(comment.goodNumber)}</label>

                        <div className={styles.evaluation_bar_background}>
                            <div className={styles.evaluation_bar} style={{ width: `${goodPercentage}%` }} />
                        </div>

                        <button className={styles.bad_btn}><FontAwesomeIcon icon={faThumbsDown} /></button>
                    </div>
                </div>
            </div>
        </>
    )
};

export default EyesReplyCommentCard;