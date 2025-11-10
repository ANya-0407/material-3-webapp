//VoicesCommentAreaコンポーネントを作成

import styles from 'src/styles/VoicesCommentArea.module.css'
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons"
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-regular-svg-icons"


const VoicesCommentArea: React.FC = () => {
    //コメント欄の表示切替
    const [isCommentVisible, setIsCommentVisible] = useState(true);

    const handleToggle = () => {
        setIsCommentVisible((prev) => !prev);
    };

    return (
        <>
            <div className={styles.voices_comment_area_wrapper}>
                <div className={styles.comment_form}>
                    <div className={styles.comment_pipe} />

                    <textarea className={styles.text_placeholder} placeholder="コメントを書く" maxLength={300} />

                    <div className={styles.btn_container}>
                        {isCommentVisible ? (
                            <button className={styles.comment_isdisplay_btn} onClick={handleToggle}>Comment <FontAwesomeIcon icon={faChevronUp} /></button>
                        ) : (
                            <button className={styles.comment_isdisplay_btn} onClick={handleToggle}>Comment <FontAwesomeIcon icon={faChevronDown} /></button>
                        )}

                        <button className={styles.comment_btn_outer}>
                            <div className={styles.comment_btn_inner} />

                            <span>コメント</span>
                        </button>

                        <div className={styles.comment_btn_line} />
                    </div>
                </div>

                {isCommentVisible ? (
                    <div className={styles.comment_wrapper}>
                        <div className={styles.comment_container}>
                            <div className={styles.comment_container_left}>
                                <button className={styles.comment_account_icon}></button>
                            </div>

                            <div className={styles.comment_container_right}>
                                <button className={styles.comment_account_name}>
                                    野次馬１
                                </button>

                                <div className={styles.comment_text_container}>
                                    イー○ン
                                    「TwitterをXにします」
                                    <br />
                                    イー○ン
                                    「無課金は色々制限します」
                                </div>

                                <div className={styles.comment_evaluation_container}>
                                    <button className={styles.evaluation_good}><FontAwesomeIcon icon={faThumbsUp} /></button>

                                    <div className={styles.evaluation_bar_background}>
                                        <div className={styles.evaluation_bar} />
                                    </div>

                                    <button className={styles.evaluation_bad}><FontAwesomeIcon icon={faThumbsDown} /></button>
                                </div>
                            </div>
                        </div>

                        <div className={styles.comment_container}>
                            <div className={styles.comment_container_left}>
                                <button className={styles.comment_account_icon}></button>
                            </div>

                            <div className={styles.comment_container_right}>
                                <button className={styles.comment_account_name}>
                                    Satoshi
                                </button>

                                <div className={styles.comment_text_container}>
                                    眠い暇ゲームしたい
                                </div>

                                <div className={styles.comment_evaluation_container}>
                                    <button className={styles.evaluation_good}><FontAwesomeIcon icon={faThumbsUp} /></button>

                                    <div className={styles.evaluation_bar_background}>
                                        <div className={styles.evaluation_bar} />
                                    </div>

                                    <button className={styles.evaluation_bad}><FontAwesomeIcon icon={faThumbsDown} /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={styles.comment_wrapper_space} />
                )}
            </div>
        </>
    )
};

export default VoicesCommentArea;