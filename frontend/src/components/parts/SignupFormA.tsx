//SignupFormAコンポーネントを作成

import styles from 'src/styles/SignupFormA.module.css'
import React, { useState } from 'react'
import { validateAlphaNumericRealTime, validateAlphaNumeriSymbolicRealTime, validateNumericRealTime } from "src/utils/validators";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAt, faLock, faUnlockKeyhole, faEye, faEyeSlash, faShieldHalved} from "@fortawesome/free-solid-svg-icons"


const SignupFormA: React.FC<{ onContinue: () => void }> = ({ onContinue }) => {
    //バリデーション
    const [inputPassword, setInputPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [inputPasswordCheck, setInputPasswordCheck] = useState('');
    const [passwordCheckError, setPasswordCheckError] = useState('');
    const [inputEmail, setInputEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [inputCertification, setInputCertification] = useState("");
    const [certificationError, setCertificationError] = useState("");
    const [isValidating, setIsValidating] = useState(false);

    const handleInputPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sanitized = validateAlphaNumericRealTime(e.target.value, 20); //20文字以下
        setInputPassword(sanitized);
        setPasswordError("");
    };

    const handleInputPasswordCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sanitized = validateAlphaNumericRealTime(e.target.value, 20); //20文字以下
        setInputPasswordCheck(sanitized);
        setPasswordCheckError("");
    };

    const handleInputEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sanitized = validateAlphaNumeriSymbolicRealTime(e.target.value, 50); //50文字以下
        setInputEmail(sanitized);
        setEmailError("");
    };

    const handleInputCertificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sanitized = validateNumericRealTime(e.target.value, 6); //6文字以下
        setInputCertification(sanitized);
        setCertificationError("");
    };

    const handleContinue = async () => {
        try {
            setIsValidating(true);

            //フロント側バリデーション
            const passwordResult = validatePasswordForSubmit(inputPassword, 8, 20); // 8〜20文字
            const passwordCheckResult = validatePasswordForSubmit(inputPasswordCheck, 8, 20); // 8〜20文字
            const emailResult = validateEmailForSubmit(inputEmail, 8, 50); // 8〜50文字
            const certificationResult = validateCertificationForSubmit(inputCertification, 6, 6); // 6文字

            if (!passwordResult.isValid || !passwordCheckResult.isValid || !emailResult.isValid || !certificationResult.isValid) {
                setPasswordError(passwordResult.error ?? "");
                setPasswordCheckError(passwordCheckResult.error ?? "");
                setEmailError(emailResult.error ?? "");
                setCertificationError(certificationResult.error ?? "");
                return;
            };

            // バックエンド処理（ダミー）
            const backendResult = await dummyBackendProcess({
                password: passwordResult.sanitized,
                passwordCheck: passwordCheckResult.sanitized,
                email: emailResult.sanitized,
                certification: certificationResult.sanitized,
            });

            if (!backendResult.success) {
                setPasswordError(backendResult.errors.passwordError ?? "");
                setPasswordCheckError(backendResult.errors.passwordCheckError ?? "");
                setEmailError(backendResult.errors.emailError ?? "");
                setCertificationError(backendResult.errors.certificationError ?? "");
                return;
            }

            // 成功時の次の処理
            onContinue();
        } finally {
            setIsValidating(false);
        }
    };

    // バックエンドの型定義
    type ErrorCode =
        | "passwords_do_not_match"
        | "email_already_registered"
        | "invalid_certification_code";

    type BackendResult = {
        success: boolean;
        errors: {
            passwordError?: ErrorCode;
            passwordCheckError?: ErrorCode;
            emailError?: ErrorCode;
            certificationError?: ErrorCode;
        };
    };

    // バックエンド処理非同期関数（ダミー）
    const dummyBackendProcess = async ({
        password,
        passwordCheck,
        email,
        certification,
    }: {
        password: string;
        passwordCheck: string;
        email: string;
        certification: string;
    }): Promise<BackendResult> => {
        await new Promise((r) => setTimeout(r, 1000)); // 疑似API待機

        const errors: BackendResult["errors"] = {};

        if (password !== passwordCheck) {
            errors.passwordError = "passwords_do_not_match";
        }

        if (email === "amane_x8@outlook.jp") {
            errors.emailError = "email_already_registered";
        }

        if (certification === "000000") {
            errors.certificationError = "invalid_certification_code";
        }

        const success = Object.keys(errors).length === 0;

        return { success, errors };
    };

    //パスワードの可視・不可視切替
    const [showButton1, setShowButton1] = useState(true);

    const toggleButtons = () => {
        setShowButton1(!showButton1);
    };

    return (
        <>
            <div className={styles.signup_form_a_wrapper}>
                <div className={styles.tytle_container}>
                    <div className={styles.tytle_point}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                    <span>アカウント作成 - 基本情報</span>
                </div>

                <div className={styles.password_wrapper}>
                    <label className={styles.password_wrapper_left}>
                        <label htmlFor="password" className={styles.password_tytle}>パスワード</label>

                        <label htmlFor="password" className={styles.password_placeholder_container}>
                            <span><FontAwesomeIcon icon={faLock} /></span>

                            <input id="password" placeholder="8～20文字" type={showButton1 ? 'password' : 'text'} maxLength={20} value={inputPassword} onChange={handleInputPasswordChange} onPaste={(e) => { e.preventDefault(); }} />

                            <br />
                            {showButton1 ? (
                                <button onClick={toggleButtons}><FontAwesomeIcon icon={faEye} /></button>
                            ) : (
                                <button onClick={toggleButtons}><FontAwesomeIcon icon={faEyeSlash} /></button>
                            )}
                            <br />
                        </label>

                        {passwordError && (
                            <span className={styles.password_error_message}>{passwordError}</span>
                        )}
                    </label>

                    <div className={styles.password_wrapper_right}>
                        <label htmlFor="password_check" className={styles.passwordcheck_tytle}>パスワードの再確認</label>

                        <label htmlFor="password_check" className={styles.passwordcheck_placeholder_container}>
                            <span><FontAwesomeIcon icon={faUnlockKeyhole} /></span>

                            <input id="password_check" placeholder="8～20文字" type='password' maxLength={20} value={inputPasswordCheck} onChange={handleInputPasswordCheckChange} onPaste={(e) => { e.preventDefault(); }} />
                        </label>

                        {passwordCheckError && (
                            <span className={styles.passwordcheck_error_message}>{passwordCheckError}</span>
                        )}
                    </div>
                </div>

                <div className={styles.dividing_line} />

                <div className={styles.mailaddress_tytle_container}>
                    <label htmlFor="email" className={styles.mailaddress_tytle}>メールアドレス認証</label>

                    {emailError && (
                        <span className={styles.mailaddress_error_message}>{emailError}</span>
                    )}
                </div>

                <label htmlFor="email" className={styles.email_placeholder_container} >
                    <span><FontAwesomeIcon icon={faAt} /></span>

                    <input id="email" placeholder="メールアドレス" type="email" maxLength={50} value={inputEmail} onChange={handleInputEmailChange} />
                </label>

                <div className={styles.email_certification_container}>
                    <div className={styles.email_certification_line1} />

                    <div className={styles.email_certification_line2} />

                    <button className={styles.email_certification_button}>確認コードを送信</button>
                </div>

                <label htmlFor="certification" className={styles.email_certification_placeholder_container} >
                    <span><FontAwesomeIcon icon={faShieldHalved} /></span>

                    <input id="certification" placeholder="確認コード(6桁)" type="tel" inputMode="tel" maxLength={6} value={inputCertification} onChange={handleInputCertificationChange} onPaste={(e) => { e.preventDefault(); }} />
                </label>

                {certificationError && (
                    <span className={styles.certification_error_message}>{certificationError}</span>
                )}

                <span className={styles.email_certication_notes}>“確認コードを送信”ボタンをクリックし、受信したメールに記載された確認コードを入力してください。確認コードを再送信する場合は1分以上時間を空ける必要があります。</span>

                {isValidating ? (
                    <div className={styles.dummy_btn}>
                        <div className={styles.loader}></div>
                    </div>
                ) : (
                    <button className={styles.continue_btn_true} onClick={handleContinue}>次へ進む</button>
                )}
            </div>
        </>
    )
};

export default SignupFormA;