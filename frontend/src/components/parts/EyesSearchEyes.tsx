//EyesSearchEyesコンポーネントを作成

import EyesCard, { EyesProps } from 'src/components/parts/EyesCard';
import styles from 'src/styles/EyesSearchEyes.module.css'
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useIsWideScreen } from "src/utils/hooks";


//サンプルデータ
const sampleEyes: EyesProps[] = [
    {
        tweetId: "1",
        tweeterId: "a",
        tweeterUserName: "Amane1",
        tweeterIcon: "/samples/image1.jpg",
        image: "/samples/image2.jpg",
        tag: "これはサンプルです。意味はありません。",
        generationTime: new Date("2025-01-01T12:00:00Z"),
        viewTime: 95000,
        goodNumber: 25000,
    },
    {
        tweetId: "2",
        tweeterId: "b",
        tweeterUserName: "Amane2",
        tweeterIcon: "/samples/image3.jpg",
        image: "/samples/image4.jpg",
        tag: "This is a sample. It has no meaning.",
        generationTime: new Date("2023-02-10T12:00:00Z"),
        viewTime: 365,
        goodNumber: 25,
    },
    {
        tweetId: "3",
        tweeterId: "c",
        tweeterUserName: "Amane3",
        tweeterIcon: "/samples/image5.jpg",
        image: "/samples/image6.jpg",
        tag: "",
        generationTime: new Date("2025-02-11T12:00:00Z"),
        viewTime: 1200,
        goodNumber: 250,
    },
];


const EyesSearchEyes: React.FC = () => {
    //画面サイズの判定
    const isWideScreen = useIsWideScreen();

    // 投稿の状態管理（PC: 左右カラム, モバイル: センターカラム）
    const [leftPosts, setLeftPosts] = useState<EyesProps[]>([]);
    const [rightPosts, setRightPosts] = useState<EyesProps[]>([]);
    const [centerPosts, setCenterPosts] = useState<EyesProps[]>([]);

    // 各カラムのDOM参照
    const leftColumnRef = useRef<HTMLDivElement | null>(null);
    const rightColumnRef = useRef<HTMLDivElement | null>(null);
    const centerColumnRef = useRef<HTMLDivElement | null>(null);

    // サーバー側の投稿データ（サンプルデータ）
    const serverDataRef = useRef<EyesProps[]>([...sampleEyes]);
    // 未処理の投稿を保持するリスト
    const remainingPostsRef = useRef<EyesProps[]>([]);
    // これ以上取得する投稿がないかのフラグ
    const noMorePostsRef = useRef<boolean>(false);
    // 連続してロードが走らないようにするフラグ
    const isLoadingRef = useRef<boolean>(false);

    // サーバーから投稿を取得する関数
    const fetchPosts = async (): Promise<EyesProps[]> => {
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
            <div className={styles.eyes_search_eyes_wrapper}>
                {isWideScreen === null ? null : isWideScreen ? (
                    <div className={styles.contents_layout_container_pc}>
                        <div className={styles.contents_layout_left} ref={leftColumnRef}>
                            {leftPosts.map((post) => (
                                <EyesCard key={post.tweetId} {...post} />
                            ))}
                        </div>
                        <div className={styles.contents_layout_right} ref={rightColumnRef}>
                            {rightPosts.map((post) => (
                                <EyesCard key={post.tweetId} {...post} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className={styles.contents_layout_container_mobile}>
                        <div className={styles.contents_layout_center} ref={centerColumnRef}>
                            {centerPosts.map((post) => (
                                <EyesCard key={post.tweetId} {...post} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
};

export default EyesSearchEyes;