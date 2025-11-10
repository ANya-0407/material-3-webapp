//EditEyesProfileFormコンポーネントを作成

import styles from 'src/styles/EditEyesProfileForm.module.css'
import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser } from "@fortawesome/free-solid-svg-icons"


// 特殊文字エスケープ処理関数
const removeSpecialCharacters = (input: string): string => {
    const regex = /[&<>"'`/*;_|{}]/g;
    return input.replace(regex, '');
};


const EditEyesProfileForm: React.FC = () => {
    const [inputName, setInputName] = useState('');
    const [inputExplanation, setInputExplanation] = useState('');

    // ページがアンマウントされる時にinputをリセット
    useEffect(() => {
        return () => {
            setInputName('');
        };
    }, []);

    useEffect(() => {
        return () => {
            setInputExplanation('');
        };
    }, []);

    const handleInputNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let valueInputName = removeSpecialCharacters(event.target.value);

        if (valueInputName.length > 20) {  //最初の20文字を取得
            valueInputName = valueInputName.slice(0, 20);
        }
        setInputName(valueInputName);

        setShowErrorMessageName(false);   // 入力が変更されたときに、エラーメッセージを非表示にする
    };

    const handleInputExplanationChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        let valueInputExplanation = removeSpecialCharacters(event.target.value);

        if (valueInputExplanation.length > 300) {  //最初の300文字を取得
            valueInputExplanation = valueInputExplanation.slice(0, 300);
        }
        setInputExplanation(valueInputExplanation);
    };

    //setting_btnを押した際の制御
    const [showErrorMessageName, setShowErrorMessageName] = useState(false);

    const handleSetting = () => {
        if (inputName.length === 0
        ) {
            setShowErrorMessageName(true);
        };

        if (inputName.length != 0
        ) {
        };
    }

    return (
        <>
            <div className={styles.edit_eyes_profile_form_wrapper}>
                <div className={styles.tytle_container}>
                    <div className={styles.tytle_point}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                    <span>プロフィールを編集</span>
                </div>

                <div className={styles.background_image}>
                </div>

                <div className={styles.background_image_line}>
                    <div className={styles.icon_flame}>
                        <div className={styles.icon_image} />
                    </div>

                    <div className={styles.icon_flame_shadow} />
                </div>

                <div className={styles.name_tytle}>
                    <h1>ユーザー名</h1>
                </div>

                <div className={styles.name_placeholder_container} >
                    <span><FontAwesomeIcon icon={faUser} /></span>

                    <input placeholder="ユーザー名" type="text" maxLength={20} value={inputName} onChange={handleInputNameChange} />
                </div>

                <div className={styles.explanation_tytle}>
                    <h1>プロフィール</h1>

                    {showErrorMessageName && (
                        <span className={styles.errormessage} style={{ color: 'red' }}>ユーザー名が未入力です</span>
                    )}
                </div>

                <div className={styles.explanation_placeholder_container} >
                    <textarea placeholder="プロフィール" maxLength={300} value={inputExplanation} onChange={handleInputExplanationChange} />
                </div>

                <button className={styles.setting_btn_true} onClick={handleSetting}>設定する</button>
            </div>
        </>
    )
};

export default EditEyesProfileForm;