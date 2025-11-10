//VoicesProfileInfoコンポーネントを作成

import EditVoicesProfileForm from 'src/components/parts/EditVoicesProfileForm'
import styles from 'src/styles/VoicesProfileInfo.module.css'
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCakeCandles, faEllipsis } from "@fortawesome/free-solid-svg-icons"


const VoicesProfileInfo: React.FC = () => {
    //EditCloudProfileFormの表示切替
    const [isFormVisible, setIsFormVisible] = useState(false);

    const toggleFormVisibility = () => {
        setIsFormVisible(!isFormVisible);
    };

    return (
        <>
            <div className={styles.voices_profile_info_wrapper}>
                <div className={styles.background_image}>
                </div>

                <div className={styles.background_image_line}>
                    <div className={styles.icon_flame}>
                        <div className={styles.icon_image} />
                    </div>

                    <div className={styles.icon_flame_shadow} />

                    <div className={styles.btn_container}>
                        <button className={styles.trace_btn} style={{ display: "none" }}>
                            <span>trace</span>
                        </button>

                        <button className={styles.edit_btn} onClick={toggleFormVisibility}>
                            <span>edit</span>
                        </button>

                        <button className={styles.menu_btn}>
                            <span><FontAwesomeIcon icon={faEllipsis} /></span>
                        </button>
                    </div>

                    <div className={styles.birthday_container}>
                        <p><FontAwesomeIcon icon={faCakeCandles} /> Born</p>
                        <span>April 7</span>
                    </div>
                </div>

                <div className={styles.account_info_name}>
                    <span className={styles.name}>
                        Amane7
                    </span>

                    <span className={styles.id}>
                        @ANYA4047
                    </span>
                </div>


                <div className={styles.number_container} >
                    <button className={styles.tracers_number_wrapper}>
                        <p>Tracers：</p>

                        <span>1.7K</span>
                    </button>

                    <button className={styles.tracing_number_wrapper}>
                        <p>Tracing：</p>

                        <span>221</span>
                    </button>
                </div>

                <span className={styles.account_info_text}>
                    『Neverness to Everness』（NTE）はHotta Studioが自主開発した超現実アーバンオープンワールドRPGです。<br />
                    Discord：https://discord.gg/ntejp<br />
                    YouTube：https://youtube.com/@NevernesstoEvernessJP
                </span>

                <div className={styles.account_info_line} />

                {isFormVisible && (
                    <div>
                        <EditVoicesProfileForm />

                        <div className={styles.form_overlay} onClick={toggleFormVisibility} />
                    </div>
                )}
            </div>
        </>
    )
};

export default VoicesProfileInfo;