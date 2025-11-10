//loginページを作成

import LoginForm from 'src/components/parts/LoginForm'
import styles from 'src/styles/LoginPage.module.css'
import Head from 'next/head'


const LoginPage: React.FC = () => {

    return (
        <>
            <Head>
                <link rel="styleSheet" href="https://unpkg.com/destyle.css@1.0.5/destyle.css" />
            </Head>

            <div className={styles.layout}>
                <LoginForm />

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

export default LoginPage;