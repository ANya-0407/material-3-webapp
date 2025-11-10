//EyesProfileInfoコンポーネントを作成

import EditEyesProfileForm from 'src/components/parts/EditEyesProfileForm'
import { EyesProfilePageInfoProps } from "src/types";
import styles from 'src/styles/EyesProfileInfo.module.css'
import React, { useState } from "react";
import { useRouter } from "next/router";
import { useIsWideScreen } from "src/utils/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAnglesLeft, faHeadset, faCakeCandles, faEllipsis } from "@fortawesome/free-solid-svg-icons"


type EyesProfileInfoProps = {
    profile: EyesProfilePageInfoProps | null | undefined;
};


const EyesProfileInfo: React.FC<EyesProfileInfoProps> = ({ profile }) => {
    //画面サイズの判定
    const isWideScreen = useIsWideScreen();

    //EditEyesProfileFormの表示切替
    const [isFormVisible, setIsFormVisible] = useState(false);

    const toggleFormVisibility = () => {
        setIsFormVisible(!isFormVisible);
    };

    //birthdayのフォーマット関数
    const formatDateToMonthDay = (date: Date): string => {
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const month = monthNames[date.getMonth()]; // 0-indexed
        const day = date.getDate();

        return `${month} ${day}`;
    };

    //followingNumberおよびfollowersNumberのフォーマット関数
    const formatNumber = (num: number): string => {
        if (num < 1000) {
            return num.toString();
        } else if (num < 1000000) {
            return (Math.round(num / 100) / 10).toFixed(1) + "k"; // 小数第1位まで表示
        } else {
            return (Math.round(num / 100000) / 10).toFixed(1) + "m"; // 小数第1位まで表示
        }
    };

    //リンク
    const router = useRouter();

    //ページをリロード
    const handleReload = () => {
        router.reload();
    };

    //liveページへのリンク
    const handleClickToLive = () => {
        router.push(`/live/${profile?.liveId}`);
    };

    //followページへのリンク
    const handleClickToFollow = () => {
        router.push(`/follow/${profile?.mainInfo.accountId}`);
    };

    return (
        <>
            {profile === undefined ? (
                <div className={styles.loader_background}>
                    <div className={styles.loading_header_image}></div>

                    <div className={styles.loader}></div>

                    <div className={styles.loader_background_border} />
                </div>
            ) : profile === null ? (
                <div className={styles.loader_background}>
                    <div className={styles.loading_header_image}></div>

                    <div className={styles.error_message}>
                        <p>ユーザーが見つかりません。</p>

                        <button onClick={handleReload}>
                            <div></div>
                            <span>リロード</span>
                        </button>
                    </div>

                    <div className={styles.loader_background_border} />
                </div>
            ) : (
                <div className={styles.eyes_profile_info_wrapper}>
                    <div className={styles.header_image_container}>
                        <img
                            className={styles.header_image}
                            src={profile.headerImage}
                            alt={`Header Image: ${profile.mainInfo.accountName}`}
                        >
                        </img>

                        <div className={styles.commentbox_btn_outer}>
                            <button className={styles.commentbox_btn_inner}>
                                <p>
                                    <span><FontAwesomeIcon icon={faAnglesLeft} /></span>Comment<br />Box
                                </p>
                            </button>
                        </div>

                        {profile.liveId &&
                            <button className={styles.live_btn} onClick={handleClickToLive}>
                                <p>
                                    <span><FontAwesomeIcon icon={faHeadset} /></span>Live
                                </p>
                            </button>
                        }
                    </div>

                    <div className={styles.header_image_border}>
                        <div className={styles.icon_flame}>
                            <img
                                className={styles.account_icon}
                                src={profile.mainInfo.accountIcon}
                                alt={`Icon Image: ${profile.mainInfo.accountName}`}
                            >
                            </img>
                        </div>

                        <div className={styles.icon_flame_shadow} />
                    </div>

                    <div className={styles.profile_row1}>
                        <div className={styles.account_name_container}>
                            <span className={styles.name}>
                                {profile.mainInfo.accountName}
                            </span>

                            <span className={styles.id}>
                                @{profile.mainInfo.accountId}
                            </span>
                        </div>

                        {isWideScreen &&
                            <div className={styles.btn_container}>
                                {profile.isOwn ? (
                                    <button className={styles.edit_btn} onClick={toggleFormVisibility}>
                                        <div></div>
                                        <span>Edit</span>
                                    </button>
                                ) : (
                                    <button className={styles.follow_btn}>
                                        <div></div>
                                        <span>Follow</span>
                                    </button>
                                )}

                                <button className={styles.menu_btn}>
                                    <span><FontAwesomeIcon icon={faEllipsis} /></span>
                                </button>
                            </div>
                        }
                    </div>


                    <div className={styles.profile_row2}>
                        <div className={styles.number_container} >
                            <button className={styles.following_number} onClick={handleClickToFollow}>
                                <p>Following：</p>

                                <span>{formatNumber(profile.followingNumber)}</span>
                            </button>

                            <button className={styles.followers_number} onClick={handleClickToFollow}>
                                <p>Followers：</p>

                                <span>{formatNumber(profile.followersNumber)}</span>
                            </button>
                        </div>

                        {isWideScreen &&
                            <div className={styles.birthday}>
                                <p><FontAwesomeIcon icon={faCakeCandles} /> Born</p>
                                <span>{formatDateToMonthDay(profile.birthday)}</span>
                            </div>
                        }
                    </div>

                    <div className={styles.account_explanation}>
                        {profile.accountExplanation}
                    </div>

                    {!isWideScreen &&
                        <div className={styles.profile_row3}>
                            <div className={styles.birthday}>
                                <p><FontAwesomeIcon icon={faCakeCandles} /> Born</p>
                                <span>{formatDateToMonthDay(profile.birthday)}</span>
                            </div>

                            <div className={styles.btn_container}>
                                <button className={styles.menu_btn}>
                                    <span><FontAwesomeIcon icon={faEllipsis} /></span>
                                </button>

                                {profile.isOwn ? (
                                    <button className={styles.edit_btn} onClick={toggleFormVisibility}>
                                        <span>edit</span>
                                    </button>
                                ) : (
                                    <button className={styles.follow_btn}>
                                        <span>follow</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    }

                    <div className={styles.profile_lower_border} />

                    {(isFormVisible && profile.isOwn) && (
                        <>
                            <EditEyesProfileForm />

                            <div className={styles.editeyesprfoileform_overlay} onClick={toggleFormVisibility} />
                        </>
                    )}
                </div>
            )}
        </>
    )
};

export default EyesProfileInfo;