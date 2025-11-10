//signupページを作成

import SignupFormA from 'src/components/parts/SignupFormA'
import SignupFormB from 'src/components/parts/SignupFormB'
import SignupFormC from 'src/components/parts/SignupFormC'
import SignupFormD from 'src/components/parts/SignupFormD'
import SignupFormE from 'src/components/parts/SignupFormE'
import SignupFormF from 'src/components/parts/SignupFormF'
import styles from 'src/styles/SignupPage.module.css'
import { useState } from 'react'
import Head from 'next/head'


const SignupPage: React.FC = () => {

    // デフォルトの状態を"A"に設定
    const [currentForm, setCurrentForm] = useState("A");

    return (
        <>
            <Head>
                <link rel="styleSheet" href="https://unpkg.com/destyle.css@1.0.5/destyle.css" />
            </Head>

            <div className={styles.layout}>
                {currentForm === 'A' &&
                    <SignupFormA onContinue={() => setCurrentForm("B")} />
                }

                {currentForm === 'B' &&
                    <SignupFormB onContinue={() => setCurrentForm("C")} />
                }

                {currentForm === 'C' &&
                    <SignupFormC onContinue={() => setCurrentForm("D")} />
                }

                {currentForm === 'D' &&
                    <SignupFormD onContinue={() => setCurrentForm("E")} />
                }

                {currentForm === 'E' &&
                    <SignupFormE onContinue={() => setCurrentForm("F")} />
                }

                {currentForm === 'F' &&
                    <SignupFormF />
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

export default SignupPage;