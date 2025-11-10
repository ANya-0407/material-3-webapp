//VoicesFollowerProfileCardコンポーネントを作成

import { VoicesFollowProfileProps } from "src/types";
import styles from 'src/styles/VoicesFollowerProfileCard.module.css'
import { useRouter } from "next/router";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck } from "@fortawesome/free-solid-svg-icons"


type VoicesFollowerProfileCardProps = {
    profile: VoicesFollowProfileProps;
};


const VoicesFollowerProfileCard: React.FC<VoicesFollowerProfileCardProps> = ({ profile }) => {
    // ルーター
    const router = useRouter();

    //画像のalt
    const iconAlt = `Icon image: ${profile.accountName}`;

    // ルーティング
    const goVoicesProfile = () => {
        router.push(
            { pathname: '/voicesprofile/[id]', query: { id: profile.accountId } },
        );
    };

    return (
        <>
            <div className={styles.voices_follower_profile_card_background}>
                <div className={styles.profile_background_left}>
                    <div className={styles.account_icon_wrapper} onClick={goVoicesProfile}>
                        <Image
                            className={styles.account_icon}
                            src={profile.accountIcon}
                            alt={iconAlt}
                            fill
                            priority={false}
                        />
                    </div>
                </div>

                <div className={styles.profile_background_right}>
                    <div className={styles.profile_background_upper} onClick={goVoicesProfile}>
                        <button className={styles.account_link_btn}>
                            <div className={styles.account_name}>
                                <span>{profile.accountName}</span>

                                {profile.isOfficial === true &&
                                    <div className={styles.official_mark}><FontAwesomeIcon icon={faCheck} /></div>
                                }

                                {profile.isMutual === true &&
                                    <div className={styles.mutual_follow_mark}>相互フォロー</div>
                                }
                            </div>

                            <span className={styles.account_id}>
                                @{profile.accountId}
                            </span>
                        </button>

                        <button className={styles.follow_btn}>
                            <div></div>
                            <span>follow</span>
                        </button>
                    </div>

                    {profile.accountExplanation !== undefined &&
                        <div className={styles.account_explanation}>
                            {profile.accountExplanation}
                        </div>
                    }
                </div>
            </div>
        </>
    )
};

export default VoicesFollowerProfileCard;