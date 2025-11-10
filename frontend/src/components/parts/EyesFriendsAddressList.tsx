//EyesFriendsAddressListコンポーネントを作成

import EyesTalkAddressCard from 'src/components/parts/EyesTalkAddressCard';
import { EyesTalkAddressApiProps, EyesTalkAddressProps, convertEyesTalkAddressProps } from "src/types";
import styles from 'src/styles/EyesFriendsAddressList.module.css'
import React, { useState, useRef, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"


// サーバーの代わりとなるサンプルデータ
const sampleAddresses: (EyesTalkAddressApiProps | null)[] = [
    {
        talk_id: "a",
        talk_name: "Amane1",
        talk_icon: "/samples/image1.jpg",
        last_modified: "2025-02-11T10:00:00Z",
        last_message: "[写真] これはサンプルです。意味はありません。",
        is_read: false
    },
    {
        talk_id: "b",
        talk_name: "Group1",
        talk_icon: "/samples/image2.jpg",
        last_modified: "2024-012-25T10:00:00Z",
        last_message: "This is a sample. It has no meaning.",
        is_read: true
    },
    null,
];


const EyesFriendsAddressList: React.FC = () => {
    // 投稿の状態管理（センターカラムのみ使用）
    const [centerAddresses, setCenterAddresses] = useState<EyesTalkAddressProps[]>([]);

    // カラムのDOM参照
    const centerColumnRef = useRef<HTMLDivElement | null>(null);

    // 初回ロードの状況
    const isFirstLoadCompleteRef = useRef(false);

    // IntersectionObserver用の監視要素
    const centerSentinelRef = useRef<HTMLDivElement | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    // サーバーのデータが尽きたことを示すフラグ
    const [noMoreAddresses, setNoMoreAddresses] = useState(false);
    const serverDataRef = useRef<(EyesTalkAddressApiProps | null)[]>([...sampleAddresses]);

    // サーバーからアドレスを1件ずつ取得する関数
    const fetchAddresses = useCallback(async (): Promise<EyesTalkAddressProps | null> => {
        if (noMoreAddresses) return null;
        const address = serverDataRef.current.shift();
        if (address === undefined) return null;
        if (address === null) {
            setNoMoreAddresses(true);
            return null;
        }
        return convertEyesTalkAddressProps(address);
    }, [noMoreAddresses]);

    // 指定したカラムの高さを取得する関数
    const getColumnHeight = (column: HTMLDivElement | null): number => {
        if (!column) return 0;
        const rect = column.getBoundingClientRect();
        const lastChild = column.lastElementChild as HTMLElement | null;
        return lastChild ? lastChild.getBoundingClientRect().bottom - rect.top : 0;
    };

    // 投稿をセンターカラムに振り分ける関数
    const distributeAddresses = useCallback(async () => {
        if (noMoreAddresses) return;
        const address = await fetchAddresses();
        if (!address) return;
        setCenterAddresses(prev => [...prev, address]);
    }, [fetchAddresses, noMoreAddresses]);

    // 初回ロードと追加アドレスの管理（IntersectionObserver を使用）
    useEffect(() => {
        // 初回ロード
        if (!isFirstLoadCompleteRef.current) {
            (async () => {
                document.body.style.overflow = "hidden";
                let centerHeight = 0;

                while (centerHeight < window.innerHeight * 3) {
                    if (noMoreAddresses) break; // アドレスが尽きたらループ終了

                    await distributeAddresses();

                    // 少し待ってから高さを更新
                    await new Promise(resolve => setTimeout(resolve, 50));
                    centerHeight = getColumnHeight(centerColumnRef.current);
                }

                isFirstLoadCompleteRef.current = true;
                document.body.style.overflow = "";
            })();
        };

        if (noMoreAddresses) return;

        // 監視対象の要素を取得（センターカラムのみ）
        const target = centerSentinelRef.current;
        if (!target) return;

        // IntersectionObserver の設定
        observerRef.current = new IntersectionObserver(async (entries) => {
            if (entries.some(entry => entry.isIntersecting) && !noMoreAddresses) {
                await distributeAddresses();
            }
        }, {
            rootMargin: `${window.innerHeight}px 0px`
        });

        // ターゲットを監視
        observerRef.current.observe(target);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [distributeAddresses, noMoreAddresses]);

    return (
        <>
            <div className={styles.eyes_friends_address_list_wrapper}>
                <div className={styles.title}>Message</div>

                <div className={styles.menu_container}>
                    <button className={styles.make_request_btn}>
                        <span><FontAwesomeIcon icon={faPlus} /></span>
                        <div>会話リクエスト</div>
                    </button>
                </div>

                {noMoreAddresses && centerAddresses.length === 0 ? (
                    <div className={styles.error_background}>
                        <p>会話はありません</p>
                    </div>
                ) : (
                    <div className={styles.address_list_container}>
                        {centerAddresses.map((address) => (
                            <EyesTalkAddressCard key={address.talkId} address={address} />
                        ))}

                        {(noMoreAddresses === false) &&
                            <div className={styles.loader_background} ref={centerSentinelRef}>
                                <div className={styles.loader_background_upper}></div>

                                <div className={styles.loader}></div>

                                <div className={styles.loader_background_lower}></div>
                            </div>
                        }
                    </div>
                )}
            </div>
        </>
    )
};

export default EyesFriendsAddressList;