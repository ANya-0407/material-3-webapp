//passwordforgotページを作成

import PasswordForgotForm from 'src/components/parts/PasswordForgotForm'
import styles from 'src/styles/PasswordForgotPage.module.css'
import Head from 'next/head'


const PasswordForgotPage: React.FC = () => {

    return (
        <>
            <Head>
                <link rel="styleSheet" href="https://unpkg.com/destyle.css@1.0.5/destyle.css" />
            </Head>

            <div className={styles.layout}>
                <PasswordForgotForm />

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

export default PasswordForgotPage;