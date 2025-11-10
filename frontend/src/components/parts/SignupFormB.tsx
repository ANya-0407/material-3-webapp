//SignupFormBコンポーネントを作成

import styles from 'src/styles/SignupFormB.module.css'
import React, { useState } from 'react'
import { validateTextRealTime, validateNumericRealTime, validateTextForSubmit, validateBirthdayForSubmit, validatePhoneForSubmit, validateCertificationForSubmit } from "src/utils/validators";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faShieldHalved, faSignature, faAngleDown, faPhoneVolume, faCalendarDays } from "@fortawesome/free-solid-svg-icons"


const SignupFormB: React.FC<{ onContinue: () => void }> = ({ onContinue }) => {
    //バリデーション
    const [inputFirstName, setInputFirstName] = useState('');
    const [inputLastName, setInputLastName] = useState('');
    const [firstNameError, setFirstNameError] = useState("");
    const [lastNameError, setLastNameError] = useState("");
    const [inputBirthYear, setInputBirthYear] = useState('');
    const [selectedBirthMonth, setSelectedBirthMonth] = useState("");
    const [selectedBirthDate, setSelectedBirthDate] = useState("");
    const [birthdayError, setBirthdayError] = useState("");
    const [inputPhone, setInputPhone] = useState('');
    const [phoneError, setPhoneError] = useState("");
    const [inputCertification, setInputCertification] = useState('');
    const [certificationError, setCertificationError] = useState("");
    const [isValidating, setIsValidating] = useState(false);

    const months = [
        { name: "1", days: 31 },
        { name: "2", days: 29 },
        { name: "3", days: 31 },
        { name: "4", days: 30 },
        { name: "5", days: 31 },
        { name: "6", days: 30 },
        { name: "7", days: 31 },
        { name: "8", days: 31 },
        { name: "9", days: 30 },
        { name: "10", days: 31 },
        { name: "11", days: 30 },
        { name: "12", days: 31 },
    ];

    // 選択された月に基づいて日付を生成
    const daysInSelectedBirthMonth = selectedBirthMonth
        ? months.find((month) => month.name === selectedBirthMonth)?.days || 0
        : 0;

    const handleInputFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sanitized = validateTextRealTime(e.target.value, 100); //100文字以下
        setInputFirstName(sanitized);
        setFirstNameError("");
    };

    const handleInputLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sanitized = validateTextRealTime(e.target.value, 100); //100文字以下
        setInputLastName(sanitized);
        setLastNameError("");
    };

    const handleInputBirthYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sanitized = validateNumericRealTime(e.target.value, 4); //4文字以下
        setInputBirthYear(sanitized);
        setBirthdayError("");
    };

    const handleSelectedBirthMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedBirthMonth(event.target.value);
        setSelectedBirthDate(""); // 月を変更した場合、日付選択をリセット

        setBirthdayError("");   // 入力が変更されたときに、エラーメッセージを非表示にする
    };

    const handleSelectedBirthDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedBirthDate(event.target.value);

        setBirthdayError("");   // 入力が変更されたときに、エラーメッセージを非表示にする
    };

    const handleInputPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sanitized = validateNumericRealTime(e.target.value, 20); //20文字以下
        setInputPhone(sanitized);
        setPhoneError("");
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
            const firstNameResult = validateTextForSubmit(inputFirstName, 1, 100); // 1〜100文字
            const lastNameResult = validateTextForSubmit(inputLastName, 1, 100); // 1〜100文字
            const birthdayResult = validateBirthdayForSubmit(parseInt(inputBirthYear, 10), parseInt(selectedBirthMonth, 10), parseInt(selectedBirthDate, 10)); 
            const phoneResult = validatePhoneForSubmit(inputPhone, 6, 20); // 8〜20文字
            const certificationResult = validateCertificationForSubmit(inputCertification, 6, 6); // 6文字

            if (!firstNameResult.isValid || !lastNameResult.isValid || !birthdayResult.isValid || !phoneResult.isValid || !certificationResult.isValid) {
                setFirstNameError(firstNameResult.error ?? "");
                setLastNameError(lastNameResult.error ?? "");
                setBirthdayError(birthdayResult.error ?? "")
                setPhoneError(phoneResult.error ?? "");
                setCertificationError(certificationResult.error ?? "");
                return;
            }

            // バックエンド処理（ダミー）
            const backendResult = await dummyBackendProcess({
                firstName: firstNameResult.sanitized,
                lastName: lastNameResult.sanitized,
                birthday: birthdayResult.sanitized,
                phone: phoneResult.sanitized,
                certification: certificationResult.sanitized,
            });

            if (!backendResult.success) {
                setFirstNameError(backendResult.errors.firstNameError ?? "");
                setLastNameError(backendResult.errors.lastNameError ?? "");
                setPhoneError(backendResult.errors.phoneError ?? "");
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
        | "first_name_blocked"
        | "last_name_blocked"
        | "birthday_erased"
        | "phone_already_registered"
        | "invalid_certification_code";

    type BackendResult = {
        success: boolean;
        errors: {
            firstNameError?: ErrorCode;
            lastNameError?: ErrorCode;
            birthdayError?: ErrorCode;
            phoneError?: ErrorCode;
            certificationError?: ErrorCode;
        };
    };

    // バックエンド処理非同期関数(ダミー)
    const dummyBackendProcess = async ({
        firstName,
        lastName,
        birthday,
        phone,
        certification,
    }: {
        firstName: string;
        lastName: string;
        birthday: string;
        phone: string;
        certification: string;
    }): Promise<BackendResult> => {
        await new Promise((r) => setTimeout(r, 1000)); // 疑似API待機

        const errors: BackendResult["errors"] = {};

        if (firstName === "侑子") {
            errors.firstNameError = "first_name_blocked";
        }

        if (lastName === "武田") {
            errors.lastNameError = "last_name_blocked";
        }

        if (birthday === "") {
            errors.birthdayError = "birthday_erased";
        }

        if (phone === "07024478648") {
            errors.phoneError = "phone_already_registered";
        }

        if (certification === "000000") {
            errors.certificationError = "invalid_certification_code";
        }

        const success = Object.keys(errors).length === 0;

        return { success, errors };
    };


    return (
        <>
            <div className={styles.signup_form_b_wrapper}>
                <div className={styles.tytle_container}>
                    <div className={styles.tytle_point}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                    <span>アカウント作成 - 詳細情報</span>
                </div>

                <span className={styles.form_notes}>
                    これらの情報がプロフィール上で公開されることはありません。
                </span>

                <div className={styles.name_wrapper}>
                    <div className={styles.name_wrapper_left}>
                        <label htmlFor="first_name" className={styles.firstname_tytle}>名</label>

                        <label htmlFor="first_name" className={styles.firstname_placeholder_container} >
                            <span><FontAwesomeIcon icon={faSignature} /></span>

                            <input id="first_name" placeholder="太郎" type="text" maxLength={100} value={inputFirstName} onChange={handleInputFirstNameChange} />
                        </label>

                        {firstNameError && (
                            <span className={styles.firstname_error_message}>{firstNameError}</span>
                        )}
                    </div>

                    <div className={styles.name_wrapper_right}>
                        <label htmlFor="last_name" className={styles.lastname_tytle}>姓</label>

                        <label htmlFor="last_name" className={styles.lastname_placeholder_container} >
                            <span><FontAwesomeIcon icon={faSignature} /></span>

                            <input id="last_name" placeholder="田中" type="text" maxLength={100} value={inputLastName} onChange={handleInputLastNameChange} />
                        </label>

                        {lastNameError && (
                            <span className={styles.lastname_error_message}>{lastNameError}</span>
                        )}
                    </div>
                </div>

                <div className={styles.birthday_tytle_container}>
                    <label htmlFor="birth_year" className={styles.birthday_tytle}>生年月日</label>

                    {birthdayError && (
                        <span className={styles.birthday_error_message}>{birthdayError}</span>
                    )}
                </div>

                <div className={styles.birthday_holder_wrapper}>
                    <label htmlFor="birth_year" className={styles.birth_year_placeholder_container} >
                        <span><FontAwesomeIcon icon={faCalendarDays} /></span>

                        <input id="birth_year" placeholder="----" type="tel" inputMode="tel" maxLength={4} value={inputBirthYear} onChange={handleInputBirthYearChange} />
                    </label>

                    <label htmlFor="birth_month" className={styles.birth_month_dropdown_container} >
                        <select id="birth_month" value={selectedBirthMonth} onChange={handleSelectedBirthMonthChange}>
                            <option value="">月</option>
                            {months.map((month, index) => (
                                <option key={index} value={month.name}>
                                    {month.name}
                                </option>
                            ))}
                        </select>

                        <span><FontAwesomeIcon icon={faAngleDown} /></span>
                    </label>

                    <label htmlFor="birth_date" className={styles.birth_date_dropdown_container} >
                        <select id="birth_date" value={selectedBirthDate} onChange={handleSelectedBirthDateChange} disabled={!selectedBirthMonth}>
                            <option value="">日</option>
                            {Array.from({ length: daysInSelectedBirthMonth }, (_, i) => i + 1).map((day) => (
                                <option key={day} value={day}>
                                    {day}
                                </option>
                            ))}
                        </select>

                        <span><FontAwesomeIcon icon={faAngleDown} /></span>
                    </label>
                </div>

                <div className={styles.dividing_line} />

                <div className={styles.phone_tytle_container}>
                    <label htmlFor="phone" className={styles.phone_tytle}>電話番号認証</label>

                    {phoneError && (
                        <span className={styles.phone_error_message}>{phoneError}</span>
                    )}
                </div>

                <label htmlFor="phone" className={styles.phone_placeholder_container} >
                    <span><FontAwesomeIcon icon={faPhoneVolume} /></span>

                    <input id="phone" placeholder="電話番号" type="tel" inputMode="tel" maxLength={20} value={inputPhone} onChange={handleInputPhoneChange} />
                </label>

                <div className={styles.phone_certification_container}>
                    <div className={styles.phone_certification_line1} />

                    <div className={styles.phone_certification_line2} />

                    <button className={styles.phone_certification_button}>確認コードを送信</button>
                </div>

                <label htmlFor="certification" className={styles.phone_certification_placeholder_container} >
                    <span><FontAwesomeIcon icon={faShieldHalved} /></span>

                    <input id="certification" placeholder="確認コード(6桁)" type="tel" inputMode="tel" maxLength={6} value={inputCertification} onChange={handleInputCertificationChange} />
                </label>

                {certificationError && (
                    <span className={styles.certification_error_message}>{certificationError}</span>
                )}

                <span className={styles.phone_certication_notes}>“確認コードを送信”ボタンをクリックし、受信したショートメールに記載された確認コードを入力してください。確認コードを再送信する場合は1分以上時間を空ける必要があります。</span>

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

export default SignupFormB;