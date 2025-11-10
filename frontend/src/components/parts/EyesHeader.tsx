//EyesHeaderコンポーネントを作成

import styles from 'src/styles/EyesHeader.module.css'
import React, { useState } from 'react'
import { useRouter } from "next/router";
import { validateTextRealTime } from "src/utils/validators";
import { searchSchema, MAX_SEARCH_LETTERS } from "src/utils/schemas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons" 


const EyesHeader: React.FC = () => {
    //ルーター
    const router = useRouter();

    //入力
    const [inputSearch, setInputSearch] = useState("");

    // リアルタイムバリデーション
    const handleInputSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputSearch(validateTextRealTime(e.target.value, MAX_SEARCH_LETTERS));
    };

    // 送信
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        const s = clampUnits(sanitizeSearch(inputSearch), MAX_SEARCH_LETTERS);
        if (!s) return; // 空なら何もしない（サイレント）
        router.push({ pathname: "/search", query: { q: s } });
    };

    return (
        <>
            <div className={styles.eyes_header_wrapper}>
                <div className={styles.header_background_upper}>
                    <p>LOGO</p>

                    <form className={styles.search_placeholder_container} onSubmit={handleSubmit}>
                        <input
                            type="text"
                            className={styles.search_placeholder}
                            placeholder="投稿・ユーザーを検索"
                            maxLength={MAX_SEARCH_LETTERS}
                            value={inputSearch}
                            onChange={handleInputSearchChange}
                            inputMode="search"
                            autoComplete="off"
                            aria-label="検索ワード"
                        />

                        <div className={styles.search_placeholder_bar} />

                        <button
                            type="submit"
                            className={styles.search_btn}
                            aria-label="検索"
                        >
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </button>
                    </form>

                    <button className={styles.menu_bar} aria-label="メニュー">
                        <span><FontAwesomeIcon icon={faBars} /></span>
                    </button>
                </div>

                <div className={styles.header_line} />
            </div>
        </>
    )
};

export default EyesHeader;