//SignupFormFコンポーネントを作成

import styles from 'src/styles/SignupFormF.module.css'
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck } from "@fortawesome/free-solid-svg-icons"


const SignupFormF: React.FC = () => {
    //ルーター
    const router = useRouter();

    //ルーティング
    const goLogin = () => router.push('/login');

    return (
        <>
            <div className={styles.signup_form_f_wrapper}>
                <div className={styles.tytle_container}>
                    <div className={styles.tytle_point}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                    <span>アカウント作成 - 完了!</span>
                </div>

                <div className={styles.completion_background}>
                    <div className={styles.completion_mark_background_outer}>
                        <div className={styles.completion_mark_background_inner}>
                            <span className={styles.completion_mark}><FontAwesomeIcon icon={faCheck} /></span>
                        </div>
                    </div>

                    <p>アカウント登録は完了しました。Verseへようこそ！</p>
                </div>

                <button className={styles.continue_btn_true} onClick={goLogin}>ログイン</button>
            </div>
        </>
    )
};

export default SignupFormF;