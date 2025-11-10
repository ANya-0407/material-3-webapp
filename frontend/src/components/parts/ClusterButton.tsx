//ClusterButtonコンポーネントを作成

import ClusterForm from 'src/components/parts/ClusterForm';
import styles from 'src/styles/ClusterButton.module.css'
import React, { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMessage } from "@fortawesome/free-regular-svg-icons"


const ClusterButton: React.FC = () => {

    //ClusterFormコンポーネントの表示切替
    const [isFormVisible, setIsFormVisible] = useState(false);

    const toggleFormVisibility = () => {
        setIsFormVisible(!isFormVisible);
    };

    return (
        <>
            <button className={styles.cluster_button} onClick={toggleFormVisibility}>
                <FontAwesomeIcon icon={faMessage} />
            </button>

            {isFormVisible && (
                <>
                    <ClusterForm />

                    <div className={styles.cluster_form_overlay} onClick={toggleFormVisibility} />
                </>
            )}
        </>
    )
};

export default ClusterButton;