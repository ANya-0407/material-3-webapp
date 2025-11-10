//EyesTalkContentsCenterコンポーネントを作成

import EyesOthersMessageCard from 'src/components/parts/EyesOthersMessageCard';
import EyesMyMessageCard from 'src/components/parts/EyesMyMessageCard';
import { EyesTalkProps, EyesMessageApiProps, EyesMessageProps, convertEyesMessageProps } from "src/types";
import styles from 'src/styles/EyesTalkContentsCenter.module.css'
import React, { useState, useRef, useEffect, useCallback } from "react";


type CurrentTalkProps = {
    talk: EyesTalkProps | null | undefined;
};


// サーバーの代わりとなるサンプルデータ
const sampleMessages: (EyesMessageApiProps | null)[] = [
    {
        message_id: "1",
        message_text: "これはサンプルです。意味はありません。",
        message_files: [
            "/samples/image1.jpg"
        ],
        quote_message: undefined,
        sender: {
            account_id: "a",
            account_name: "Amane1",
            account_icon: "/samples/image2.jpg"
        },
        created_at: "2024-02-11T10:00:00Z",
        is_own: false,
        is_read: true,
    },
    {
        message_id: "2",
        message_text: "これはサンプルです。意味はありません。",
        message_files: [],
        quote_message: undefined,
        sender: {
            account_id: "b",
            account_name: "Amane2",
            account_icon: "/samples/image3.jpg"
        },
        created_at: "2025-02-11T10:00:00Z",
        is_own: true,
        is_read: true,
    },
    {
        message_id: "3",
        message_text: "３学期に制作した「理想の間取り」の作品を、持ち帰ってほしいと思います。SHR後に美術室に立ち寄り、持ち帰ってくれるとありがたいです。今日、21日（金）、24日（月）の17時までに取りに来てください。よろしくお願いします。",
        message_files: [],
        quote_message: undefined,
        sender: {
            account_id: "a",
            account_name: "Amane3",
            account_icon: "/samples/image4.jpg"
        },
        created_at: "2025-02-28T10:00:00Z",
        is_own: false,
        is_read: true,
    },
    {
        message_id: "4",
        message_text: undefined,
        message_files: [
            "/samples/image5.jpg",
            "/samples/image6.jpg",
            "/samples/image7.jpg",
            "/samples/image8.jpg"
        ],
        quote_message: undefined,
        sender: {
            account_id: "b",
            account_name: "Amane4",
            account_icon: "/samples/image9.jpg"
        },
        created_at: "2025-03-11T12:00:00Z",
        is_own: true,
        is_read: true,
    },
    {
        message_id: "5",
        message_text: "３時ひま？",
        message_files: [
            "/samples/image10.jpg",
            "/samples/image11.jpg",
            "/samples/image1.jpg",
        ],
        quote_message: {
            message_id: "4",
            message_text: undefined,
            message_files: [
                "/samples/image2.jpg",
                "/samples/image3.jpg",
                "/samples/image4.jpg",
                "/samples/image5.jpg"
            ],
            quote_message: undefined,
            sender: {
                account_id: "b",
                account_name: "Amane5",
                account_icon: "/samples/image6.jpg"
            },
            created_at: "2025-03-11T12:00:00Z",
            is_own: false,
            is_read: true,
        },
        sender: {
            account_id: "a",
            account_name: "Amane6",
            account_icon: "/samples/image7.jpg"
        },
        created_at: "2025-03-02T10:00:00Z",
        is_own: false,
        is_read: true,
    },
    {
        message_id: "6",
        message_text: "多分家いないから厳しい",
        message_files: [],
        quote_message: {
            message_id: "5",
            message_text: "３時ひま？",
            message_files: [
                "/samples/image8.jpg",
                "/samples/image9.jpg",
                "/samples/image10.jpg"
            ],
            quote_message: {
                message_id: "4",
                message_text: undefined,
                message_files: [
                    "/samples/image11.jpg",
                    "/samples/image1.jpg",
                    "/samples/image2.jpg",
                    "/samples/image3.jpg"

                ],
                quote_message: undefined,
                sender: {
                    account_id: "b",
                    account_name: "Amane7",
                    account_icon: "/samples/image4.jpg"
                },
                created_at: "2025-03-11T12:00:00Z",
                is_own: false,
                is_read: true,
            },
            sender: {
                account_id: "a",
                account_name: "Amane8",
                account_icon: "/samples/image5.jpg"
            },
            created_at: "2025-02-11T10:00:00Z",
            is_own: true,
            is_read: true,
        },
        sender: {
            account_id: "b",
            account_name: "Amane9",
            account_icon: "/samples/image6.jpg"
        },
        created_at: "2025-03-19T10:00:00Z",
        is_own: true,
        is_read: false,
    },
    null,
];


const EyesTalkContentsCenter: React.FC<CurrentTalkProps> = ({ talk }) => {
    // メッセージの状態管理（センターカラムのみ使用）
    const [centerMessages, setCenterMessages] = useState<EyesMessageProps[]>([]);

    // カラムのDOM参照
    const centerColumnRef = useRef<HTMLDivElement | null>(null);

    // 初回ロードの状況
    const isFirstLoadCompleteRef = useRef(false);

    // IntersectionObserver用の監視要素
    const centerSentinelRef = useRef<HTMLDivElement | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    // サーバーのデータが尽きたことを示すフラグ
    const [noMoreMessages, setNoMoreMessages] = useState(false);
    const serverDataRef = useRef<(EyesMessageApiProps | null)[]>([...sampleMessages]);

    // サーバーからメッセージを1件ずつ取得する関数
    const fetchMessages = useCallback(async (): Promise<EyesMessageProps | null> => {
        if (noMoreMessages) return null;
        const message = serverDataRef.current.shift();
        if (message === undefined) return null;
        if (message === null) {
            setNoMoreMessages(true);
            return null;
        }
        return convertEyesMessageProps(message);
    }, [noMoreMessages]);

    // 指定したカラムの高さを取得する関数
    const getColumnHeight = (column: HTMLDivElement | null): number => {
        if (!column) return 0;
        const rect = column.getBoundingClientRect();
        const lastChild = column.lastElementChild as HTMLElement | null;
        return lastChild ? lastChild.getBoundingClientRect().bottom - rect.top : 0;
    };

    // 投稿をセンターカラムに振り分ける関数
    const distributeMessages = useCallback(async () => {
        if (noMoreMessages) return;
        const message = await fetchMessages();
        if (!message) return;
        setCenterMessages(prev => [...prev, message]);
    }, [fetchMessages, noMoreMessages]);

    // 初回ロードと追加メッセージの管理（IntersectionObserver を使用）
    useEffect(() => {
        // 初回ロード
        if (!isFirstLoadCompleteRef.current) {
            (async () => {
                document.body.style.overflow = "hidden";
                let centerHeight = 0;

                while (centerHeight < window.innerHeight * 3) {
                    if (noMoreMessages) break; // メッセージが尽きたらループ終了

                    await distributeMessages();

                    // 少し待ってから高さを更新
                    await new Promise(resolve => setTimeout(resolve, 50));
                    centerHeight = getColumnHeight(centerColumnRef.current);
                }

                isFirstLoadCompleteRef.current = true;
                document.body.style.overflow = "";
            })();
        };

        if (noMoreMessages) return;

        // 監視対象の要素を取得（センターカラムのみ）
        const target = centerSentinelRef.current;
        if (!target) return;

        // IntersectionObserver の設定
        observerRef.current = new IntersectionObserver(async (entries) => {
            if (entries.some(entry => entry.isIntersecting) && !noMoreMessages) {
                await distributeMessages();
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
    }, [distributeMessages, noMoreMessages]);

    return (
        <>
            {talk === undefined ? (
                <div className={styles.loader_background}>
                    <div className={styles.loader}></div>
                </div>
            ) : talk === null ? (
                <div className={styles.error_background}>
                    <p>会話を選択してください</p>

                    <button>
                        <div></div>
                        <span>新たな会話</span>
                    </button>
                </div>
            ) : (
                <div className={styles.eyes_talk_contents_center_wrapper}>
                    <div className={styles.typing_loader_container}>
                        
                    </div>

                    {centerMessages.map((message) =>
                        message.isOwn ? (
                            <EyesMyMessageCard key={message.messageId} message={message} />
                        ) : (
                            <EyesOthersMessageCard key={message.messageId} message={message} />
                        )
                    )}

                    {(noMoreMessages === false) &&
                        <div className={styles.loader_background} ref={centerSentinelRef}>
                            <div className={styles.loader_background_upper}></div>

                            <div className={styles.loader}></div>

                            <div className={styles.loader_background_lower}></div>
                        </div>
                    }
                </div>
            )}
        </>
    )
};

export default EyesTalkContentsCenter;