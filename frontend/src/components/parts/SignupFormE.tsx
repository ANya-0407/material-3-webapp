//SignupFormEコンポーネントを作成

import styles from 'src/styles/SignupFormE.module.css'
import React, { useState } from 'react'


const SignupFormE: React.FC<{ onContinue: () => void }> = ({ onContinue }) => {
    const [isLoading, setIsLoading] = useState(false);

    //continue_btnを押した際の制御
    const handleContinue = async () => {
        try {
            setIsLoading(true);

            // バックエンドにてアカウント作成処理
            await new Promise((r) => setTimeout(r, 1000)); // 疑似API待機

            // 成功時の次の処理
            onContinue();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className={styles.signup_form_e_wrapper}>
                <div className={styles.tytle_container}>
                    <div className={styles.tytle_point}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                    <span>アカウント作成 - 同意書</span>
                </div>

                <div className={styles.consent_background}>
                    <p>同意書</p>

                    <div className={styles.consent_dividing_line} />
                </div>

                {isLoading ? (
                    <div className={styles.dummy_btn}>
                        <div className={styles.loader}></div>
                    </div>
                ) : (
                    <button className={styles.continue_btn_true} onClick={handleContinue}>同意する</button>
                )}
            </div>
        </>
    )
};

export default SignupFormE;