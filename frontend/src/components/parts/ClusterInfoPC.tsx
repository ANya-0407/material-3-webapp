//ClusterInfoPCコンポーネントを作成

import { ClusterProps } from "src/types";
import styles from 'src/styles/ClusterInfoPC.module.css'
import { useRouter } from "next/router";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleLeft, faUsers, faEllipsis } from "@fortawesome/free-solid-svg-icons"
import { faBookmark } from "@fortawesome/free-regular-svg-icons"


type ClusterInfoProps = {
    cluster: ClusterProps | null | undefined;
};


const ClusterInfoPC: React.FC<ClusterInfoProps> = ({ cluster }) => {
    //ルーター
    const router = useRouter();

    //participantsNumberのフォーマット関数
    const formatNumber = (num: number): string => {
        if (num < 1000) {
            return num.toString();
        } else if (num < 1000000) {
            return (Math.round(num / 100) / 10).toFixed(1) + "k"; // 小数第1位まで表示
        } else {
            return (Math.round(num / 100000) / 10).toFixed(1) + "m"; // 小数第1位まで表示
        }
    };

    //画像のalt
    const iconAlt = cluster
        ? `Icon Image: ${cluster.creator.aliasName}`
        : ``;
    const imageAlt = cluster
        ? `Header Image: ${cluster.clusterName}`
        : ``;

    //ページをリロード
    const handleReload = () => {
        router.reload();
    };

    return (
        <>
            {cluster === undefined ? (
                <div className={styles.loader_background}>
                    <div className={styles.loading_header_image}></div>

                    <div className={styles.loader}></div>
                </div>
            ) : cluster === null ? (
                <div className={styles.loader_background}>
                    <div className={styles.loading_header_image}></div>

                    <div className={styles.error_message}>
                        <p>クラスターが見つかりません。</p>

                        <button onClick={handleReload}>
                            <div></div>
                            <span>リロード</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className={styles.cluster_info_pc_wrapper}>
                    <div className={styles.header_image_container}>
                        <div className={styles.header_image_wrapper}>
                            <Image
                                className={styles.header_image}
                                src={cluster.headerImage}
                                alt={imageAlt}
                                fill
                                style={{ objectFit: "cover", objectPosition: "center" }}
                                priority={false}
                            />
                        </div>

                        <button className={styles.back_btn} onClick={() => router.back()}>
                            <FontAwesomeIcon icon={faAngleLeft} />
                        </button>
                    </div>

                    <div className={styles.cluster_info_contents}>
                        <div className={styles.cluster_name}>
                            {cluster.clusterName}
                        </div>

                        <div className={styles.details_container}>
                            <div className={styles.creator_details}>
                                <div className={styles.creator_icon_wrapper}>
                                    <Image
                                        className={styles.creator_icon}
                                        src={cluster.creator.aliasIcon}
                                        alt={iconAlt}
                                        fill
                                        priority={false}
                                    />
                                </div>

                                <div className={styles.creator_name}>
                                    {cluster.creator.aliasName}
                                </div>
                            </div>

                            <div className={styles.btn_container}>
                                <button className={styles.participants}>
                                    <span><FontAwesomeIcon icon={faUsers} /></span>{formatNumber(cluster.participantsNumber)}
                                </button>


                                <button className={styles.bookmark_btn}><FontAwesomeIcon icon={faBookmark} /></button>

                                <button className={styles.menu_btn}><FontAwesomeIcon icon={faEllipsis} /></button>
                            </div>
                        </div>

                        <div className={styles.cluster_explanation}>
                            {cluster.clusterExplanation}
                        </div>

                        {!cluster.isParticipating &&
                            <button className={styles.participate_btn}>
                                <div></div>
                                <span>参加</span>
                            </button>
                        }
                    </div>
                </div>
            )}
        </>
    )
};

export default ClusterInfoPC;