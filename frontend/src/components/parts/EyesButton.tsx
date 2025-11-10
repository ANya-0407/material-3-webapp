//EyesButtonコンポーネントを作成

import EyesForm from 'src/components/parts/EyesForm';
import styles from 'src/styles/EyesButton.module.css'
import React, { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMessage } from "@fortawesome/free-regular-svg-icons"


const EyesButton: React.FC = () => {
    //EyesFormコンポーネントの表示切替
    const [isFormVisible, setIsFormVisible] = useState(false);

    const toggleFormVisibility = () => {
        setIsFormVisible(!isFormVisible);
    };

    return (
        <>
            <button className={styles.eyes_button} onClick={toggleFormVisibility}>
                <FontAwesomeIcon icon={faMessage} />
            </button>

            {isFormVisible && (
                <>
                    <EyesForm />

                    <div className={styles.eyes_form_overlay} onClick={toggleFormVisibility} />
                </>
            )}
        </>
    )
};

export default EyesButton;