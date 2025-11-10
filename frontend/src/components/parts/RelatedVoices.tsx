//RelatedVoicesコンポーネントを作成

import VoicesCard, { VoicesProps } from 'src/components/parts/VoicesCard';
import styles from 'src/styles/RelatedVoices.module.css';
import React, { useState, useRef, useEffect, useCallback } from "react";


//サンプルデータ
const sampleVoices: VoicesProps[] = [
    {
        cloudId: "1",
        clouderId: "a",
        clouderUserName: "Amane1",
        clouderIcon: "/samples/image1.jpg",
        imageList: ["/samples/image2.jpg"],
        text: "これはサンプルです。意味はありません。",
        generationTime: new Date("2025-01-01T12:00:00Z"),
        viewTime: 95000,
        goodNumber: 25000,
    },
    {
        cloudId: "2",
        clouderId: "b",
        clouderUserName: "Amane2",
        clouderIcon: "/samples/image3.jpg",
        imageList: ["/samples/image4.jpg", "/samples/image5.jpg", "/samples/image6.jpg"],
        text: "This is a sample. It has no meaning.",
        generationTime: new Date("2023-02-10T12:00:00Z"),
        viewTime: 365,
        goodNumber: 25,
    },
    {
        cloudId: "3",
        clouderId: "c",
        clouderUserName: "Amane3",
        clouderIcon: "/samples/image7.jpg",
        imageList: [],
        text: "これはサンプルです。意味はありません。",
        generationTime: new Date("2025-02-11T12:00:00Z"),
        viewTime: 1200,
        goodNumber: 250,
    },
];


const RelatedVoices: React.FC = () => {
    // 投稿の状態管理（常にセンターカラムのみ使用）
    const [centerPosts, setCenterPosts] = useState<VoicesProps[]>([]);

    // カラムのDOM参照
    const centerColumnRef = useRef<HTMLDivElement | null>(null);

    // サーバー側の投稿データ（サンプルデータ）
    const serverDataRef = useRef<VoicesProps[]>([...sampleVoices]);
    // 未処理の投稿を保持するリスト
    const remainingPostsRef = useRef<VoicesProps[]>([]);
    // これ以上取得する投稿がないかのフラグ
    const noMorePostsRef = useRef<boolean>(false);
    // 連続してロードが走らないようにするフラグ
    const isLoadingRef = useRef<boolean>(false);

    // サーバーから投稿を取得する関数
    const fetchPosts = async (): Promise<VoicesProps[]> => {
        const batchSize = 3;
        return serverDataRef.current.splice(0, batchSize);
    };

    // カラムの高さを取得する関数
    const getColumnHeight = (column: HTMLDivElement | null): number => {
        if (!column) return 0;
        const rect = column.getBoundingClientRect();
        const lastChild = column.lastElementChild as HTMLElement | null;
        return lastChild ? lastChild.getBoundingClientRect().bottom - rect.top : 0;
    };

    // 投稿をカラムに追加する関数
    const distributePosts = useCallback(async () => {
        const threshold = window.innerHeight * 2;
        while (true) {
            await new Promise((resolve) => requestAnimationFrame(resolve));
            const container = centerColumnRef.current;
            if (!container) break;
            if (getColumnHeight(container) >= threshold) break;
            if (remainingPostsRef.current.length === 0) {
                const fetched = await fetchPosts();
                if (fetched.length === 0) {
                    noMorePostsRef.current = true;
                    break;
                }
                remainingPostsRef.current.push(...fetched);
            }
            const post = remainingPostsRef.current.shift();
            if (!post) break;
            setCenterPosts((prev) => [...prev, post]);
        }
    }, []);

    // 投稿を読み込む関数
    const loadMorePosts = useCallback(async () => {
        if (isLoadingRef.current || noMorePostsRef.current) return;
        isLoadingRef.current = true;
        await distributePosts();
        isLoadingRef.current = false;
    }, [distributePosts]);

    // スクロール時に投稿を追加
    useEffect(() => {
        const handleScroll = () => loadMorePosts();
        window.addEventListener("scroll", handleScroll);
        loadMorePosts();
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loadMorePosts]);

    return (
        <>
            <div className={styles.related_voices_wrapper} ref={centerColumnRef}>
                {centerPosts.map((post) => (
                    <VoicesCard key={post.cloudId} {...post} />
                ))}
            </div>
        </>
    )
};

export default RelatedVoices;