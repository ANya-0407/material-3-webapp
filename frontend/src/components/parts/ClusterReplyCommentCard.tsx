//ClusterReplyCommentCardコンポーネントを作成

import { ClusterCommentProps } from "src/types";
import styles from 'src/styles/ClusterReplyCommentCard.module.css'
import { useRouter } from "next/router";
import Image from "next/image";
import { useIsWideScreen } from "src/utils/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEllipsis } from "@fortawesome/free-solid-svg-icons"
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-regular-svg-icons"


type ClusterCommentCardProps = {
    comment: ClusterCommentProps;
};


const ClusterReplyCommentCard: React.FC<ClusterCommentCardProps> = ({ comment }) => {
    //ルーター
    const router = useRouter();

    //画面サイズの判定
    const isWideScreen = useIsWideScreen();

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
    const iconAlt = `Icon Image: ${comment.commentater.aliasName}`;

    //ルーティング
    const goVoicesProfile = () => {
        router.push(`/voicesprofile/${comment.commentater.aliasId}`);
    };

    return (
        <>
            <div className={styles.reply_comment_background}>
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
                    </div>
                </div>
            </div>
        </>
    )
};

export default ClusterReplyCommentCard;