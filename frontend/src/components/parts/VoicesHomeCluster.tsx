//VoicesHomeClusterコンポーネントを作成

import styles from 'src/styles/VoicesHomeCluster.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser } from "@fortawesome/free-solid-svg-icons"


const VoicesHomeCluster: React.FC = () => {

    return (
        <>
            <div className={styles.voices_home_cluster_wrapper}>
                <div className={styles.contents_layout_row}>
                    <div className={styles.clustercard_background}>
                        <div className={styles.cluster_image}></div>

                        <span className={styles.cluster_title}>
                            Nintendo Switch(有機ELモデル) JoyCon(L) ネオンブルー/(R) ネオンレッドSaaaaaaaaaaaaaaaS
                        </span>

                        <div className={styles.participants_number}>
                            <p><FontAwesomeIcon icon={faUser} /></p>

                            <span>
                                367
                            </span>
                        </div>
                    </div>

                    <div className={styles.clustercard_background}>
                        <div className={styles.cluster_image}></div>

                        <span className={styles.cluster_title}>
                            Nintendo Switch(有機ELモデル) JoyCon(L) ネオンブルー/(R) ネオンレッド
                        </span>

                        <div className={styles.participants_number}>
                            <p><FontAwesomeIcon icon={faUser} /></p>

                            <span>
                                367
                            </span>
                        </div>
                    </div>

                    <div className={styles.clustercard_background}>
                        <div className={styles.cluster_image}></div>

                        <span className={styles.cluster_title}>
                            Nintendo Switch(有機ELモデル) JoyCon(L) ネオンブルー/(R) ネオンレッド
                        </span>

                        <div className={styles.participants_number}>
                            <p><FontAwesomeIcon icon={faUser} /></p>

                            <span>
                                367
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default VoicesHomeCluster;