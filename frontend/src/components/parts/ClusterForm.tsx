//ClusterFormコンポーネントを作成

import styles from 'src/styles/ClusterForm.module.css'
import React, { useRef, useState, useEffect } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons"
import { faFile } from "@fortawesome/free-regular-svg-icons"


// 特殊文字エスケープ処理関数
const removeSpecialCharacters = (input: string): string => {
    const regex = /[&<>"'`/*;_|{}]/g;
    return input.replace(regex, '');
};


const ClusterForm: React.FC = () => {
    //ファイルのアップロード
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];

        if (selectedFile) {
            const isImage = selectedFile.type === "image/png" || selectedFile.type === "image/jpeg";
            const isText = selectedFile.type === "text/plain";

            if (isImage || isText) {
                setFile(selectedFile);
            } else {
                alert("Only .png, .jpeg, and .txt files are allowed.");
            }
        }
    };

    const handleDelete = () => {
        setFile(null);
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    //画像追加ボタンとその内部の<span>の挙動を調整
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    //バリデーション
    const [inputText, setInputText] = useState('');

    useEffect(() => {
        return () => {
            setInputText('');
        };
    }, []);

    const handleInputTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        let valueInputText = removeSpecialCharacters(event.target.value);

        if (valueInputText.length > 400) {  //最初の400文字を取得
            valueInputText = valueInputText.slice(0, 400);
        }
        setInputText(valueInputText);
    };

    return (
        <>
            <div className={styles.cluster_form_wrapper}>
                <div className={styles.cluster_form_header}>
                    <span>Cluster を作成</span>
                </div>

                <div className={styles.cluster_form_contents}>
                    <div className={styles.image_tytle}>
                        ヘッダー画像を設定
                    </div>

                    <div className={styles.image_slot_box}>
                        {file ? (
                            <div className={styles.image_slot}>
                                {file.type === "text/plain" ? (
                                    <div className={styles.txt_file_thumbnail}>
                                        <p><FontAwesomeIcon icon={faFile} /></p>
                                    </div>
                                ) : (
                                    <img src={URL.createObjectURL(file)} alt="Preview" className={styles.image_preview} />
                                )}

                                <button className={styles.delete_btn} onClick={handleDelete}>
                                    <FontAwesomeIcon icon={faXmark} />
                                </button>
                            </div>
                        ) : (
                            <div className={styles.image_slot_empty}>
                                <button
                                    className={styles.upload_btn}
                                    onClick={handleButtonClick}
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <span style={{ transition: 'transform 0.3s ease', transform: isHovered ? 'rotate(-45deg)' : 'none' }}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </span>
                                </button>

                                <input
                                    type="file"
                                    accept=".png,.jpeg,.txt"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    style={{ display: "none" }}
                                />
                            </div>
                        )}
                    </div>

                    <textarea className={styles.tag_placeholder} placeholder="説明 (100文字以内)" maxLength={100} value={inputText} onChange={handleInputTextChange} />

                    <div className={styles.btn_container}>
                        <button className={styles.post_btn_true}>
                            <div></div>
                            <span>作成</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
};

export default ClusterForm;