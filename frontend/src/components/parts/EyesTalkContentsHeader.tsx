//EyesTalkContentsHeaderコンポーネントを作成

import { EyesTalkProps } from "src/types";
import styles from 'src/styles/EyesTalkContentsHeader.module.css'
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEllipsis } from "@fortawesome/free-solid-svg-icons"


type CurrentTalkProps = {
    talk: EyesTalkProps | null | undefined;
};


const EyesTalkContentsHeader: React.FC<CurrentTalkProps> = ({ talk }) => {
    //画像のalt
    const iconAlt = talk 
        ? `Icon Image: ${talk.talkName}`
        : ``;

    return (
        <>
            {talk === undefined ? (
                <div className={styles.loader_background}></div>
            ) : talk === null ? (
                <div className={styles.error_background}></div>
            ) : (
                <>
                    {talk.isGroup ? (
                        <div className={styles.eyes_talk_contents_header_wrapper_group}>
                            <div className={styles.talk_icon_wrapper}>
                                <Image
                                    className={styles.talk_icon}
                                    src={talk.talkIcon}
                                    alt={iconAlt}
                                    fill
                                    priority={false}
                                />
                            </div>

                            <div className={styles.talk_name}>
                                {talk.talkName}
                            </div>

                            <button className={styles.group_setting_btn}>
                                <span><FontAwesomeIcon icon={faEllipsis} /></span>
                            </button>
                        </div>
                    ) : (
                        <div className={styles.eyes_talk_contents_header_wrapper_direct}>
                            <div className={styles.talk_icon_wrapper}>
                                <Image
                                    className={styles.talk_icon}
                                    src={talk.talkIcon}
                                    alt={iconAlt}
                                    fill
                                    priority={false}
                                />
                            </div>

                            <div className={styles.talk_name}>
                                {talk.talkName}
                            </div>

                            <button className={styles.direct_setting_btn}>
                                <span><FontAwesomeIcon icon={faEllipsis} /></span>
                            </button>
                        </div>
                    )}
                </>
            )}
        </>
    )
};

export default EyesTalkContentsHeader;