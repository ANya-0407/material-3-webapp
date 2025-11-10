//MainVoicesコンポーネントを作成

import styles from 'src/styles/MainVoices.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEllipsis, faBullhorn, faHeart } from "@fortawesome/free-solid-svg-icons"
import { faEye, faBookmark } from "@fortawesome/free-regular-svg-icons"


const MainVoices: React.FC = () => {

    return (
        <>
            <div className={styles.main_voices_wrapper}>
                <div className={styles.main_voices_upper}>
                    <button className={styles.account_icon}></button>

                    <button className={styles.account_name}>
                        Amane7
                    </button>

                    <span className={styles.voices_time}>
                        9/28
                    </span>
                </div>

                <button className={styles.voices_text_container}>
                    <span>
                        イー○ン
                        「TwitterをXにします」
                        <br />
                        イー○ン
                        「無課金は色々制限します」
                    </span>
                </button>

                <div className={styles.voices_image_one}>
                    <div className={styles.voices_image_two}>
                        <div className={styles.voices_image_four}></div>

                        <div className={styles.voices_image_four}></div>
                    </div>

                    <div className={styles.voices_image_two}>
                        <div className={styles.voices_image_four}></div>

                        <div className={styles.voices_image_four}></div>
                    </div>
                </div>

                <div className={styles.main_voices_lower}>
                    <div className={styles.voices_viewtime}>
                        <p><FontAwesomeIcon icon={faEye} /></p>

                        <span>3.5k</span>
                    </div>

                    <div className={styles.voices_btn_container}>
                        <button className={styles.btn_ellipsis}><FontAwesomeIcon icon={faEllipsis} /></button>

                        <button className={styles.btn_report}><FontAwesomeIcon icon={faBullhorn} /></button>

                        <button className={styles.btn_bookmark}><FontAwesomeIcon icon={faBookmark} /></button>

                        <button className={styles.btn_heart}>
                            <p><FontAwesomeIcon icon={faHeart} /></p>

                            <span>1.7k</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
};

export default MainVoices;