//PassworForgotFormコンポーネントを作成

import styles from 'src/styles/PasswordForgotForm.module.css'
import React, { useState } from 'react'
import { validateNumericRealTime, validateAlphaNumeriSymbolicRealTime } from "src/utils/validators";
import { passwordForgotSchema } from "src/utils/schemas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAt, faPhoneVolume, faShieldHalved } from "@fortawesome/free-solid-svg-icons"


const PasswordForgotForm: React.FC = () => {
    //バリデーション
    const [inputPhone, setInputPhone] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [inputEmail, setInputEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [inputCertification, setInputCertification] = useState("");
    const [certificationError, setCertificationError] = useState("");
    const [isValidating, setIsValidating] = useState(false);

    const handleInputPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sanitized = validateNumericRealTime(e.target.value, 20); //20文字以下
        setInputPhone(sanitized);
        setPhoneError("");
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

    const handleSubmit = async () => {
        try {
            setIsValidating(true);

            // Zod によるフロントバリデーション
            const frontResult = passwordForgotSchema.safeParse({
                phone: inputPhone,
                email: inputEmail,
                certification: inputCertification,
            });

            if (!frontResult.success) {
                const fieldErrors = frontResult.error.flatten().fieldErrors;

                // string | undefined → string 
                setPhoneError(fieldErrors.phone?.[0] ?? "");
                setEmailError(fieldErrors.email?.[0] ?? "");
                setCertificationError(fieldErrors.certification?.[0] ?? "");

                return;
            }

            // バックエンド処理（ダミー）
            const backendResult = await dummyBackendProcess(frontResult.data);

            if (!backendResult.success) {
                setPhoneError(backendResult.errors.phoneError ?? "");
                setEmailError(backendResult.errors.emailError ?? "");
                setCertificationError(backendResult.errors.certificationError ?? "");
                return;
            }

            // 成功時の次の処理
        } finally {
            setIsValidating(false);
        }
    };

    // BackendResultの型定義
    type BackendResult = {
        success: boolean;
        errors: {
            phoneError?: string;
            emailError?: string;
            certificationError?: string;
        };
    };

    // バックエンド処理非同期関数（ダミー）
    const dummyBackendProcess = async ({
        phone,
        email,
        certification,
    }: {
        phone: string;
        email: string;
        certification: string;
    }): Promise<BackendResult> => {
        await new Promise((r) => setTimeout(r, 1000)); // 疑似API待機

        const errors: BackendResult["errors"] = {};

        // Zod によるバリデーション
        const result = passwordForgotSchema.safeParse({
            phone: phone,
            email: email,
            certification: certification,
        });

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;

            // string | undefined → string 
            errors.phoneError = fieldErrors.phone?.[0];
            errors.emailError = fieldErrors.email?.[0];
            errors.certificationError = fieldErrors.certification?.[0];
        }

        //何らかのバリデーション実行

        const success = Object.keys(errors).length === 0;

        return { success, errors };
    };

    return (
        <>
            <div className={styles.password_forgot_form_wrapper}>
                <div className={styles.tytle_container}>
                    <div className={styles.tytle_point}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                    <span>アカウントを探す</span>
                </div>

                <span className={styles.form_notes}>
                    アカウントを作成した際に登録した情報を入力してログインし、パスワードの再設定を行ってください。
                </span>

                <div className={styles.phone_tytle_container}>
                    <label htmlFor="phone" className={styles.phone_tytle}>電話番号</label>

                    {phoneError && (
                        <span className={styles.phone_error_message}>{phoneError}</span>
                    )}
                </div>

                <label htmlFor="phone" className={styles.phone_placeholder_container} >
                    <span><FontAwesomeIcon icon={faPhoneVolume} /></span>

                    <input id="phone" className={styles.phone_placeholder} placeholder="電話番号" type="tel" inputMode="tel" maxLength={20} value={inputPhone} onChange={handleInputPhoneChange} />
                </label>

                <div className={styles.dividing_line} />

                <div className={styles.mailaddress_tytle_container}>
                    <label htmlFor="email" className={styles.mailaddress_tytle}>メールアドレス認証</label>

                    {emailError && (
                        <span className={styles.mailaddress_error_message}>{emailError}</span>
                    )}
                </div>

                <label htmlFor="email" className={styles.email_placeholder_container} >
                    <span><FontAwesomeIcon icon={faAt} /></span>

                    <input id="email" className={styles.email_placeholder} placeholder="メールアドレス" type="email" inputMode="email" maxLength={50} value={inputEmail} onChange={handleInputEmailChange} />
                </label>

                <div className={styles.email_certification_container}>
                    <div className={styles.email_certification_line1} />

                    <div className={styles.email_certification_line2} />

                    <button className={styles.email_certification_button}>確認コードを送信</button>
                </div>

                <label htmlFor="certification" className={styles.email_certification_placeholder_container} >
                    <span><FontAwesomeIcon icon={faShieldHalved} /></span>

                    <input id="certification" className={styles.email_certification_placeholder} placeholder="確認コード(6桁)" type="tel" inputMode="tel" maxLength={6} value={inputCertification} onChange={handleInputCertificationChange} onPaste={(e) => { e.preventDefault(); }} />
                </label>

                {certificationError && (
                    <span className={styles.certification_error_message}>{certificationError}</span>
                )}
                
                <span className={styles.email_certication_notes}>“確認コードを送信”ボタンをクリックし、受信したメールに記載された確認コードを入力してください。確認コードを再送信する場合は1分以上時間を空ける必要があります。</span>

                {isValidating ? (
                    <div className={styles.dummy_btn}>
                        <div className={styles.loader}></div>
                    </div>
                ): (
                    <button className={styles.continue_btn_true} onClick={handleSubmit}>ログイン</button>
                )}
            </div>
        </>
    )
};

export default PasswordForgotForm;