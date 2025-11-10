//ClusterButtonコンポーネントを作成

import ClusterCommentForm from 'src/components/parts/ClusterCommentForm';
import styles from 'src/styles/ClusterCommentButton.module.css'
import React, { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMessage } from "@fortawesome/free-regular-svg-icons"


const ClusterButton: React.FC = () => {
    
    //ClusterFormの表示切替
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
                    <ClusterCommentForm />

                    <div className={styles.cluster_form_overlay} onClick={toggleFormVisibility} />
                </>
            )}
        </>
    )
};

export default ClusterButton;