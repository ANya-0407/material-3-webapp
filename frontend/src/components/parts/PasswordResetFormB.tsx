//PasswordResetFormBコンポーネントを作成

import styles from 'src/styles/PasswordResetFormB.module.css'
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck } from "@fortawesome/free-solid-svg-icons"


const PasswordResetFormB: React.FC = () => {
    //ルーター
    const router = useRouter();

    //ルーティング
    const goEyesHome = () => router.push('/eyeshome');

    return (
        <>
            <div className={styles.password_reset_form_b_wrapper}>
                <div className={styles.tytle_container}>
                    <div className={styles.tytle_point}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                    <span>パスワード再設定 - 完了!</span>
                </div>

                <div className={styles.completion_background}>
                    <div className={styles.completion_mark_background_outer}>
                        <div className={styles.completion_mark_background_inner}>
                            <span className={styles.completion_mark}><FontAwesomeIcon icon={faCheck} /></span>
                        </div>
                    </div>

                    <p>パスワードの再設定が完了しました。</p>
                </div>

                <button className={styles.continue_btn} onClick={goEyesHome}>ホームに移動</button>
            </div>
        </>
    )
};

export default PasswordResetFormB;