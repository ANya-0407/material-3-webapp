//PasswordResetFormAコンポーネントを作成

import styles from 'src/styles/PasswordResetFormA.module.css'
import React, { useState } from 'react'
import { validateAlphaNumericRealTime, validatePasswordForSubmit } from "src/utils/validators";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLock, faUnlockKeyhole, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"


const PasswordResetFormA: React.FC<{ onContinue: () => void }> = ({ onContinue }) => {
    //バリデーション
    const [inputPassword, setInputPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [inputPasswordCheck, setInputPasswordCheck] = useState('');
    const [passwordCheckError, setPasswordCheckError] = useState('');
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

    const handleContinue = async () => {
        try {
            setIsValidating(true);

            //フロント側バリデーション
            const passwordResult = validatePasswordForSubmit(inputPassword, 8, 20); // 8〜20文字
            const passwordCheckResult = validatePasswordForSubmit(inputPasswordCheck, 8, 20); // 8〜20文字

            if (!passwordResult.isValid || !passwordCheckResult.isValid) {
                setPasswordError(passwordResult.error ?? "");
                setPasswordCheckError(passwordCheckResult.error ?? "");
                return;
            };

            // バックエンド処理（ダミー）
            const backendResult = await dummyBackendProcess({
                password: passwordResult.sanitized,
                passwordCheck: passwordCheckResult.sanitized,
            });

            if (!backendResult.success) {
                setPasswordError(backendResult.errors.passwordError ?? "");
                setPasswordCheckError(backendResult.errors.passwordCheckError ?? "");
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
        | "passwords_do_not_match";

    type BackendResult = {
        success: boolean;
        errors: {
            passwordError?: ErrorCode;
            passwordCheckError?: ErrorCode;
        };
    };

    // バックエンド処理非同期関数（ダミー）
    const dummyBackendProcess = async ({
        password,
        passwordCheck,
    }: {
        password: string;
        passwordCheck: string;
    }): Promise<BackendResult> => {
        await new Promise((r) => setTimeout(r, 1000)); // 疑似API待機

        const errors: BackendResult["errors"] = {};

        if (password !== passwordCheck) {
            errors.passwordError = "passwords_do_not_match";
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
            <div className={styles.password_reset_form_a_wrapper}>
                <div className={styles.tytle_container}>
                    <div className={styles.tytle_point}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                    <span>パスワード再設定</span>
                </div>

                <span className={styles.form_notes}>
                    セキュリティ性の高いパスワードを設定し、忘れないように管理してください。
                </span>

                <div className={styles.dividing_line} />

                <div className={styles.password_wrapper}>
                    <div className={styles.password_wrapper_left}>
                        <label htmlFor="password" className={styles.password_tytle}>新しいパスワード</label>

                        <label htmlFor="password" className={styles.password_placeholder_container}>
                            <span><FontAwesomeIcon icon={faLock} /></span>

                            <input id="password" placeholder="8～20文字" inputMode="tel" type={showButton1 ? 'password' : 'text'} maxLength={20} value={inputPassword} onChange={handleInputPasswordChange} onPaste={(e) => { e.preventDefault(); }} />

                            <br />
                            {showButton1 ? (
                                <button onClick={toggleButtons}><FontAwesomeIcon icon={faEyeSlash} /></button>
                            ) : (
                                <button onClick={toggleButtons}><FontAwesomeIcon icon={faEye} /></button>
                            )}
                            <br />
                        </label>

                        {passwordError && (
                            <span className={styles.password_error_message}>{passwordError}</span>
                        )}
                    </div>

                    <div className={styles.password_wrapper_right}>
                        <label htmlFor="password_check" className={styles.passwordcheck_tytle}>パスワードの再確認</label>

                        <label htmlFor="password_check" className={styles.passwordcheck_placeholder_container}>
                            <span><FontAwesomeIcon icon={faUnlockKeyhole} /></span>

                            <input id="password_check" placeholder="8～20文字" inputMode="tel" type="password" maxLength={20} value={inputPasswordCheck} onChange={handleInputPasswordCheckChange} onPaste={(e) => { e.preventDefault(); }} />
                        </label>

                        {passwordCheckError && (
                            <span className={styles.passwordcheck_error_message}>{passwordCheckError}</span>
                        )}
                    </div>
                </div>

                {isValidating ? (
                    <div className={styles.dummy_btn}>
                        <div className={styles.loader}></div>
                    </div>
                ): (
                    <button className={styles.continue_btn_true} onClick={handleContinue}>設定する</button>
                )}
            </div>
        </>
    )
};

export default PasswordResetFormA;