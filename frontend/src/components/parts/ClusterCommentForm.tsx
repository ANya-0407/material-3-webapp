//ClusterCommentFormコンポーネントを作成

import styles from 'src/styles/ClusterCommentForm.module.css'
import React, { useRef, useState, useEffect } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faXmark, faBan } from "@fortawesome/free-solid-svg-icons"
import { faFile } from "@fortawesome/free-regular-svg-icons"


// 特殊文字エスケープ処理関数
const removeSpecialCharacters = (input: string): string => {
    const regex = /[&<>"'`/*;_|{}]/g;
    return input.replace(regex, '');
};


const ClusterCommentForm: React.FC = () => {
    //ファイルアップロード部分の実装
    const MAX_SLOTS = 4;

    // 初期状態: ファイルリスト
    const [files, setFiles] = useState<(File | null)[]>(Array(MAX_SLOTS).fill(null));

    // useRefの型を正しく設定
    const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // useEffectでrefsを正しく初期化
    React.useEffect(() => {
        fileInputRefs.current = Array(MAX_SLOTS)
            .fill(null)
            .map((_, i) => fileInputRefs.current[i] || null);
    }, []);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const selectedFile = event.target.files?.[0];

        if (selectedFile) {
            const isImage = selectedFile.type === "image/png" || selectedFile.type === "image/jpeg";
            const isText = selectedFile.type === "text/plain";

            if (isImage || isText) {
                const newFiles = [...files];
                newFiles[index] = selectedFile;
                setFiles(newFiles);
            } else {
                alert("Only .png, .jpeg, and .txt files are allowed.");
            }
        }
    };

    const handleDelete = (index: number) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        newFiles.push(null); // 空きスロットを末尾に追加
        setFiles(newFiles);
    };

    const handleButtonClick = (index: number) => {
        fileInputRefs.current[index]?.click();
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
            <div className={styles.cluster_comment_form_wrapper}>
                <div className={styles.cluster_comment_form_header}>
                    <span>コメントを追加</span>
                </div>

                <div className={styles.form_contents}>
                    <textarea className={styles.text_placeholder} placeholder="コメント" maxLength={400} value={inputText} onChange={handleInputTextChange} />

                    <div className={styles.image_background}>
                        <div className={styles.image_slot_container} id="scrollable">
                            {files.map((file, index) => {
                                const isEmpty = files.slice(0, index).includes(null);

                                return (
                                    <div key={index} className={styles.image_slot_box}>
                                        {file ? (
                                            <div className={styles.image_slot}>
                                                {file.type === "text/plain" ? (
                                                    <div className={styles.txt_file_thumbnail}>
                                                        <p><FontAwesomeIcon icon={faFile} /></p>
                                                    </div>
                                                ) : (
                                                    <img src={URL.createObjectURL(file)} alt="Preview" className={styles.image_preview} />
                                                )}

                                                <button className={styles.delete_btn} onClick={() => handleDelete(index)}>
                                                    <FontAwesomeIcon icon={faXmark} />
                                                </button>
                                            </div>
                                        ) : !isEmpty ? (
                                            <div className={styles.image_slot_empty}>
                                                <button className={styles.upload_btn} onClick={() => handleButtonClick(index)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} >
                                                    <span style={{ transition: 'transform 0.3s ease', transform: isHovered ? 'rotate(-45deg)' : 'none', }}><FontAwesomeIcon icon={faPlus} /></span>
                                                </button>

                                                <input
                                                    type="file"
                                                    accept=".png,.jpeg,.txt"
                                                    ref={(el: HTMLInputElement | null) => {
                                                        fileInputRefs.current[index] = el;
                                                    }}
                                                    onChange={(e) => handleFileUpload(e, index)}
                                                    style={{ display: "none" }}
                                                />
                                            </div>
                                        ) : (
                                            <div className={styles.inactive_image_slot}>
                                                <span><FontAwesomeIcon icon={faBan} /></span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className={styles.btn_container}>
                        <button className={styles.post_btn_true}>
                            <div></div>
                            <span>投稿</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
};

export default ClusterCommentForm;