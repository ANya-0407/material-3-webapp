//VoicesHomeFollowingコンポーネントを作成

import VoicesTrendCard from 'src/components/parts/VoicesTrendCard';
import VoicesCard, { VoicesProps } from 'src/components/parts/VoicesCard';
import styles from 'src/styles/VoicesHomeFollowing.module.css'
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useIsWideScreen } from "src/utils/hooks";


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


const VoicesHomeFollowing: React.FC = () => {
    //画面サイズの判定
    const isWideScreen = useIsWideScreen();

    // 投稿の状態管理（PC: 左右カラム, モバイル: センターカラム）
    const [leftPosts, setLeftPosts] = useState<VoicesProps[]>([]);
    const [rightPosts, setRightPosts] = useState<VoicesProps[]>([]);
    const [centerPosts, setCenterPosts] = useState<VoicesProps[]>([]);

    // 各カラムのDOM参照
    const leftColumnRef = useRef<HTMLDivElement | null>(null);
    const rightColumnRef = useRef<HTMLDivElement | null>(null);
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
        // 例：実際は下記のようなコードで取得
        // const res = await fetch('/api/tweets');
        // return await res.json();

        // サンプルとして、1回につき全件取得（ここでは batchSize を 3 としている）
        const batchSize = 3;
        const posts = serverDataRef.current.splice(0, batchSize);
        return posts;
    };

    // 指定したカラムの高さを取得する関数
    const getColumnHeight = (column: HTMLDivElement | null): number => {
        if (!column) return 0;
        const rect = column.getBoundingClientRect();
        const lastChild = column.lastElementChild as HTMLElement | null;
        return lastChild ? lastChild.getBoundingClientRect().bottom - rect.top : 0;
    };

    // PC用の投稿をカラムに振り分ける関数
    const distributePostsPC = useCallback(async () => {
        const threshold = window.innerHeight * 2;
        while (true) {
            await new Promise((resolve) => requestAnimationFrame(resolve));
            const leftHeight = getColumnHeight(leftColumnRef.current);
            const rightHeight = getColumnHeight(rightColumnRef.current);
            if (Math.max(leftHeight, rightHeight) >= threshold) break;
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
            if (leftHeight <= rightHeight) {
                setLeftPosts((prev) => [...prev, post]);
            } else {
                setRightPosts((prev) => [...prev, post]);
            }
        }
    }, []);

    // モバイル用の投稿をカラムに振り分ける関数
    const distributePostsMobile = useCallback(async () => {
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
        if (isLoadingRef.current || noMorePostsRef.current || isWideScreen === null) return;
        isLoadingRef.current = true;
        if (isWideScreen) {
            await distributePostsPC();
        } else {
            await distributePostsMobile();
        }
        isLoadingRef.current = false;
    }, [isWideScreen, distributePostsPC, distributePostsMobile]);

    // スクロール時に投稿を追加
    useEffect(() => {
        if (isWideScreen === null) return;
        const handleScroll = () => loadMorePosts();
        window.addEventListener("scroll", handleScroll);
        loadMorePosts();
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isWideScreen, loadMorePosts]);

    return (
        <>
            <div className={styles.voices_home_tracing_wrapper}>
                {isWideScreen === null ? null : isWideScreen ? (
                    <div className={styles.contents_layout_container_pc}>
                        <div className={styles.contents_layout_left} ref={leftColumnRef}>
                            {leftPosts.map((post) => (
                                <VoicesCard key={post.cloudId} {...post} />
                            ))}
                        </div>
                        <div className={styles.contents_layout_right} ref={rightColumnRef}>
                            <VoicesTrendCard />

                            {rightPosts.map((post) => (
                                <VoicesCard key={post.cloudId} {...post} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className={styles.contents_layout_container_mobile}>
                        <div className={styles.contents_layout_center} ref={centerColumnRef}>
                            {centerPosts.map((post) => (
                                <VoicesCard key={post.cloudId} {...post} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
};

export default VoicesHomeFollowing;