//EyesRequestContentsコンポーネントを作成

import styles from 'src/styles/EyesRequestContents.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronRight, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons"


const EyesRequestContents: React.FC = () => {

    return (
        <>
            <div className={styles.eyes_request_contents_wrapper}>
                <div className={styles.direct_request_header}>
                    <button id="direct_request_header_account_btn" className={styles.direct_request_header_icon_image}></button>

                    <label htmlFor="direct_request_header_account_btn" className={styles.direct_request_header_account_name}>
                        Amane7
                    </label>

                    <span className={styles.request_time}>19:00</span>
                </div>

                <div className={styles.group_request_header} style={{ display: "none" }}>
                    <button id="group_request_header_account_btn" className={styles.group_request_header_icon_image}></button>

                    <label htmlFor="group_request_header_account_btn" className={styles.group_request_header_account_name}>
                        Amane7
                    </label>

                    <span className={styles.request_time}>19:00</span>
                </div>

                <div className={styles.direct_request_center}>
                    <div className={styles.first_message_text}>
                        しゃぶ漬けパンダしゅんた
                    </div>
                </div>

                <div className={styles.group_request_center} style={{ display: "none" }}>
                    <div className={styles.group_request_information}>
                        <div className={styles.group_request_icon_image}></div>

                        <div className={styles.group_request_information_line} />

                        <div className={styles.group_request_group_name}>
                            Amane7
                        </div>

                        <button className={styles.group_request_member_btn}>
                            メンバー <FontAwesomeIcon icon={faChevronRight} />
                        </button>

                        <span>グループチャット</span>
                    </div>
                </div>

                <div className={styles.direct_request_footer}>
                    <button className={styles.direct_request_accept_btn}>
                        <div>
                            <p><FontAwesomeIcon icon={faCheck} /></p>
                            <span>承認</span>
                        </div>
                    </button>

                    <button className={styles.direct_request_reject_btn}>
                        <div>
                            <p><FontAwesomeIcon icon={faXmark} /></p>
                            <span>拒否</span>
                        </div>
                    </button>
                </div>

                <div className={styles.group_request_footer} style={{ display: "none" }}>
                    <button className={styles.group_request_accept_btn}>
                        <div>
                            <p><FontAwesomeIcon icon={faCheck} /></p>
                            <span>承認</span>
                        </div>
                    </button>

                    <button className={styles.group_request_reject_btn}>
                        <div>
                            <p><FontAwesomeIcon icon={faXmark} /></p>
                            <span>拒否</span>
                        </div>
                    </button>
                </div>
            </div>
        </>
    )
};

export default EyesRequestContents;