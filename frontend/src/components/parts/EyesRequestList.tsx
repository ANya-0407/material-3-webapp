//EyesRequestListコンポーネントを作成

import styles from 'src/styles/EyesRequestList.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons"


const EyesRequestList: React.FC = () => {

    return (
        <>
            <div className={styles.eyes_request_list_wrapper}>
                <div className={styles.menu_container}>
                    <div className={styles.search_placeholder_container}>
                        <input className={styles.search_placeholder} placeholder="Search.." type="text" maxLength={20} />

                        <button className={styles.search_btn}><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
                    </div>

                    <button className={styles.make_request_btn}>
                        <span><FontAwesomeIcon icon={faPlus} /></span>
                        <div>会話リクエスト</div>
                    </button>
                </div>

                <p>Message</p>

                <div className={styles.request_list_container}>
                    <div className={styles.direct_request_card}>
                        <div className={styles.account_icon_image}></div>

                        <div className={styles.account_name}>
                            Amane7
                        </div>
                    </div>

                    <div className={styles.group_request_card}>
                        <div className={styles.group_icon_image}></div>

                        <div className={styles.group_name}>
                            高木聡の陰謀論評議会
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default EyesRequestList;