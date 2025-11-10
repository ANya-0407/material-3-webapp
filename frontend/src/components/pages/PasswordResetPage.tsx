//passwordresetページを作成

import PasswordResetFormA from 'src/components/parts/PasswordResetFormA'
import PasswordResetFormB from 'src/components/parts/PasswordResetFormB'
import styles from 'src/styles/PasswordResetPage.module.css'
import { useState } from 'react'
import Head from 'next/head'


const PasswordResetPage: React.FC = () => {

    // デフォルトの状態を"A"に設定
    const [currentForm, setCurrentForm] = useState("A");

    return (
        <>
            <Head>
                <link rel="styleSheet" href="https://unpkg.com/destyle.css@1.0.5/destyle.css" />
            </Head>

            <div className={styles.layout}>
                {currentForm === 'A' &&
                    <PasswordResetFormA onContinue={() => setCurrentForm("B")} />
                }

                {currentForm === 'B' &&
                    <PasswordResetFormB />
                }

                <div className={styles.background_animation}>
                    <div className={styles.street}>
                        <div className={styles.row_lines}>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default PasswordResetPage;