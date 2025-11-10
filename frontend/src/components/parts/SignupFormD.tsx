//SignupFormDコンポーネントを作成

import styles from 'src/styles/SignupFormD.module.css'
import React, { useState } from 'react'
import { validateTextRealTime, validateAlphaNumericRealTime, validateTextForSubmit, validateAlphaNumericForSubmit } from "src/utils/validators";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser, faAt } from "@fortawesome/free-solid-svg-icons"


const SignupFormC: React.FC<{ onContinue: () => void }> = ({ onContinue }) => {
    //バリデーション
    const [inputEyesName, setInputEyesName] = useState("");
    const [eyesNameError, setEyesNameError] = useState("");
    const [inputEyesId, setInputEyesId] = useState("");
    const [eyesIdError, setEyesIdError] = useState("");
    const [inputVoicesName, setInputVoicesName] = useState("");
    const [voicesNameError, setVoicesNameError] = useState("");
    const [inputVoicesId, setInputVoicesId] = useState("");
    const [voicesIdError, setVoicesIdError] = useState("");
    const [isValidating, setIsValidating] = useState(false);

    const handleInputEyesNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sanitized = validateTextRealTime(e.target.value, 30); //30文字以下
        setInputEyesName(sanitized);
        setEyesNameError("");
    };

    const handleInputEyesIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sanitized = validateAlphaNumericRealTime(e.target.value, 20); //20文字以下
        setInputEyesId(sanitized);
        setEyesIdError("");
    };

    const handleInputVoicesNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sanitized = validateTextRealTime(e.target.value, 30); //30文字以下
        setInputVoicesName(sanitized);
        setVoicesNameError("");
    };

    const handleInputVoicesIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sanitized = validateAlphaNumericRealTime(e.target.value, 20); //20文字以下
        setInputVoicesId(sanitized);
        setVoicesIdError("");
    };

    const handleContinue = async () => {
        try {
            setIsValidating(true);

            //フロント側バリデーション
            const eyesNameResult = validateTextForSubmit(inputEyesName, 1, 30); // 30文字以下
            const eyesIdResult = validateAlphaNumericForSubmit(inputEyesId, 1, 20); // 20文字以下
            const voicesNameResult = validateTextForSubmit(inputEyesName, 1, 30); // 30文字以下
            const voicesIdResult = validateAlphaNumericForSubmit(inputEyesId, 1, 20); // 20文字以下

            if (!eyesNameResult.isValid || !eyesIdResult.isValid || !voicesNameResult.isValid || !voicesIdResult.isValid) {
                setEyesNameError(eyesNameResult.error ?? "");
                setEyesIdError(eyesIdResult.error ?? "");
                setVoicesNameError(voicesNameResult.error ?? "");
                setVoicesIdError(voicesIdResult.error ?? "");
                return;
            };

            // バックエンド処理（ダミー）
            const backendResult = await dummyBackendProcess({
                eyesName: eyesNameResult.sanitized,
                eyesId: eyesIdResult.sanitized,
                voicesName: voicesNameResult.sanitized,
                voicesId: voicesIdResult.sanitized,
            });

            if (!backendResult.success) {
                setEyesNameError(backendResult.errors.eyesNameError ?? "");
                setEyesIdError(backendResult.errors.eyesIdError ?? "");
                setVoicesNameError(backendResult.errors.voicesNameError ?? "");
                setVoicesIdError(backendResult.errors.voicesIdError ?? "");
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
        | "name_reserved"
        | "id_already_registered";

    type BackendResult = {
        success: boolean;
        errors: {
            eyesNameError?: ErrorCode;
            eyesIdError?: ErrorCode;
            voicesNameError?: ErrorCode;
            voicesIdError?: ErrorCode;
        };
    };

    // バックエンド処理非同期関数（ダミー）
    const dummyBackendProcess = async ({
        eyesName,
        eyesId,
        voicesName,
        voicesId,
    }: {
        eyesName: string;
        eyesId: string;
        voicesName: string;
        voicesId: string;
    }): Promise<BackendResult> => {
        await new Promise((r) => setTimeout(r, 1000)); // 疑似API待機

        const errors: BackendResult["errors"] = {};

        if (eyesName === "武田侑子") {
            errors.eyesNameError = "name_reserved";
        }

        if (eyesId === "Amane") {
            errors.eyesIdError = "id_already_registered";
        }

        if (voicesName === "武田侑子") {
            errors.voicesNameError = "name_reserved";
        }

        if (voicesId === "Amane") {
            errors.voicesIdError = "id_already_registered";
        }

        const success = Object.keys(errors).length === 0;

        return { success, errors };
    };

    return (
        <>
            <div className={styles.signup_form_d_wrapper}>
                <div className={styles.tytle_container}>
                    <div className={styles.tytle_point}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                    <span>アカウント作成 - 名前とID</span>
                </div>

                <div className={styles.form_notes}>
                    Verse内での名前を決めましょう！<br/>
                    アカウント名は後から変更可能ですが、IDは変更できません。じっくり考えましょう。<br/>
                    また、EyesとVoicesで同じ名前やIDを用いるのは関連を秘匿したい場合非推奨です。
                </div>

                <div className={styles.eyes_tytle}>Eyes</div>

                <div className={styles.eyes_name_tytle_container}>
                    <label htmlFor="eyes_name" className={styles.eyes_name_tytle}>アカウント名</label>

                    {eyesNameError && (
                        <span className={styles.eyes_name_error_message}>{eyesNameError}</span>
                    )}
                </div>

                <label htmlFor="eyes_name" className={styles.eyes_name_placeholder_container} >
                    <span><FontAwesomeIcon icon={faUser} /></span>

                    <input id="eyes_name" className={styles.eyes_name_placeholder} placeholder="30文字以内" type="text"　maxLength={30} value={inputEyesName} onChange={handleInputEyesNameChange} />
                </label>

                <div className={styles.eyes_id_tytle_container}>
                    <label htmlFor="eyes_id" className={styles.eyes_id_tytle}>ID</label>

                    {eyesIdError && (
                        <span className={styles.eyes_id_error_message}>{eyesIdError}</span>
                    )}
                </div>

                <label htmlFor="eyes_id" className={styles.eyes_id_placeholder_container} >
                    <span><FontAwesomeIcon icon={faAt} /></span>

                    <input id="eyes_id" className={styles.eyes_id_placeholder} placeholder="英数字/20文字以内" type="text" maxLength={20} value={inputEyesId} onChange={handleInputEyesIdChange} />
                </label>

                <div className={styles.dividing_line} />

                <div className={styles.voices_tytle}>Voices</div>

                <div className={styles.voices_name_tytle_container}>
                    <label htmlFor="voices_name" className={styles.voices_name_tytle}>アカウント名</label>

                    {voicesNameError && (
                        <span className={styles.voices_name_error_message}>{voicesNameError}</span>
                    )}
                </div>

                <label htmlFor="voices_name" className={styles.voices_name_placeholder_container} >
                    <span><FontAwesomeIcon icon={faUser} /></span>

                    <input id="voices_name" className={styles.voices_name_placeholder} placeholder="30文字以内" type="text" maxLength={30} value={inputVoicesName} onChange={handleInputVoicesNameChange} />
                </label>

                <div className={styles.voices_id_tytle_container}>
                    <label htmlFor="voices_id" className={styles.voices_id_tytle}>ID</label>

                    {voicesIdError && (
                        <span className={styles.voices_id_error_message}>{voicesIdError}</span>
                    )}
                </div>

                <label htmlFor="voices_id" className={styles.voices_id_placeholder_container} >
                    <span><FontAwesomeIcon icon={faAt} /></span>

                    <input id="voices_id" className={styles.voices_id_placeholder} placeholder="英数字/20文字以内" type="text" maxLength={20} value={inputVoicesId} onChange={handleInputVoicesIdChange} />
                </label>
                
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

export default SignupFormC;