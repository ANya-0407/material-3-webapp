//ClusterCardコンポーネントを作成

import { ClusterProps } from "src/types";
import styles from 'src/styles/ClusterCard.module.css'
import { useRouter } from "next/router";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUsers } from "@fortawesome/free-solid-svg-icons"


type ClusterCardProps = {
    cluster: ClusterProps;
};


const ClusterCard: React.FC<ClusterCardProps> = ({ cluster }) => {
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
    const imageAlt = `Header Image: ${cluster.clusterName}`;

    //ルーティング
    const goCluster = () => {
        router.push(
            { pathname: '/cluster/[id]', query: { id: cluster.clusterId } },
        );
    };

    return (
        <>
            <div className={styles.cluster_card_background} onClick={goCluster}>
                <div className={styles.participants_number}>
                    <FontAwesomeIcon icon={faUsers} /> {formatNumber(cluster.participantsNumber)}
                </div>

                {cluster.isParticipating &&
                    <div className={styles.participating_mark}>
                        参加済み
                    </div>
                }

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

                <div className={styles.cluster_card_middle}>
                    <div className={styles.gradation_top}></div>

                    <div className={styles.cluster_name}>
                        {cluster.clusterName}
                    </div>

                    <div className={styles.gradation_under}></div>
                </div>

                <div className={styles.cluster_explanation}>
                    {cluster.clusterExplanation}
                </div>
            </div>
        </>
    )
};

export default ClusterCard;