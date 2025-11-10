//SignupFormCコンポーネントを作成

import styles from 'src/styles/SignupFormC.module.css'


const SignupFormC: React.FC<{ onContinue: () => void }> = ({ onContinue }) => {
    const handleContinue =  () => {
        onContinue();
    };

    return (
        <>
            <div className={styles.signup_form_c_wrapper}>
                <div className={styles.tytle_container}>
                    <div className={styles.tytle_point}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                    <span>アカウント作成 - Verseについて</span>
                </div>

                <div className={styles.form_notes}>
                    Verse内には、次の2つのプラットフォームが存在します。あなたはそれぞれで、異なる名義を使い分けることが出来ます。
                </div>

                <div className={styles.explanation_wrapper}>
                    <div className={styles.eyes_explanation_container}>
                        <div className={styles.eys_tytle}>Eyes</div>

                        <img className={styles.eyes_image} src="https://example.com/icon1.jpg" alt="Eyes Image" ></img>

                        <div className={styles.eyes_explanation}>
                            ここでは、日常の中であなたが体験し、あなたの目に映った光景を友達やフォロワーに共有出来ます。
                            見たいものを見つけ、見せたい自分を見せるのです。
                        </div>
                    </div>

                    <div className={styles.dividing_line}></div>

                    <div className={styles.voices_explanation_container}>
                        <div className={styles.voices_tytle}>Voices</div>

                        <img className={styles.voices_image} src="https://example.com/icon2.jpg" alt="Voices Image" ></img>

                        <div className={styles.voices_explanation}>
                            ここは、あなたが日常を離れ、秘めた声をつぶやく場所。
                            新たなコミュニティを見つけ、小さな笑いを共有しましょう。
                        </div>
                    </div>
                </div>

                <div className={styles.final_notes}>
                    世界に飛び込む準備は出来ましたか？
                </div>
                
                <button className={styles.continue_btn_true} onClick={handleContinue}>次へ進む</button>
            </div>
        </>
    )
};

export default SignupFormC;