//VoicesButtonコンポーネントを作成

import VoicesForm from 'src/components/parts/VoicesForm';
import styles from 'src/styles/VoicesButton.module.css'
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMessage } from "@fortawesome/free-regular-svg-icons"


//VoicesFormを開く唯一の親
const VoicesButton: React.FC = () => {
    //引用元のVoicesId
    const [quotedVoicesId, setQuotedVoicesId] = useState<string | null>(null);

    //VoicesFormの表示
    const [isFormVisible, setIsFormVisible] = useState(false);

    //VoicesFormの表示切替
    const toggleFormVisibility = () => {
        setIsFormVisible(!isFormVisible);
    };

    // VoicesCard からのグローバルイベントを受けて開く
    useEffect(() => {
        const handler = (e: Event) => {
            const ce = e as CustomEvent<{ quotedVoicesId?: string }>;
            setQuotedVoicesId(ce.detail?.quotedVoicesId ?? null);
            setIsFormVisible(true);
        };
        window.addEventListener('openVoicesForm', handler as EventListener);
        return () => window.removeEventListener('openVoicesForm', handler as EventListener);
    }, []);

    return (
        <>
            <button className={styles.voices_button} onClick={toggleFormVisibility}>
                <FontAwesomeIcon icon={faMessage} />
            </button>

            {isFormVisible && (
                <>
                    <VoicesForm quotedVoicesId={quotedVoicesId ?? undefined} />

                    <div className={styles.voices_form_overlay} onClick={toggleFormVisibility} />
                </>
            )}
        </>
    )
};

export default VoicesButton;