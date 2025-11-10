//VoicesHomeAllコンポーネントを作成

import VoicesTrendCard from 'src/components/parts/VoicesTrendCard';
import VoicesCard from 'src/components/parts/VoicesCard';
import { VoicesApiProps, VoicesProps, convertVoicesProps } from "src/types";
import styles from 'src/styles/VoicesHomeAll.module.css'
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useIsWideScreen } from "src/utils/hooks";


// サーバーの代わりとなるサンプルデータ
const sampleVoices: (VoicesApiProps | null)[] = [
    {
        voices_id: "1",
        poster: {
            account_id: "a",
            account_name: "Amane1",
            account_icon: "/samples/image1.jpg"
        },
        text: "これはサンプルです。意味はありません。",
        images: [
            "/samples/image2.jpg",
        ],
        hashtag: "#Sample",
        created_at: "2025-01-01T12:00:00Z",
        view_count: 95000,
        good_count: 25000,
        is_own: true,
        is_good_for_me: false,
        is_my_bookmark: false
    },
    {
        voices_id: "3",
        poster: {
            account_id: "c",
            account_name: "Amane3",
            account_icon: "/samples/image7.jpg"
        },
        text: "This is a sample. It has no meaning.",
        images: [],
        hashtag: "#mixwell",
        created_at: "2025-02-11T12:00:00Z",
        view_count: 1200,
        good_count: 250,
        is_own: false,
        is_good_for_me: true,
        is_my_bookmark: true
    },
    {
        voices_id: "2",
        poster: {
            account_id: "b",
            account_name: "Amane2",
            account_icon: "/samples/image3.jpg"
        },
        text: "これはサンプルです。意味はありません。これはサンプルです。意味はありません。これはサンプルです。意味はありません。",
        images: [
            "/samples/image4.jpg",
            "/samples/image5.jpg",
            "/samples/image6.jpg",
        ],
        created_at: "2023-02-10T12:00:00Z",
        view_count: 365,
        good_count: 25,
        is_own: false,
        is_good_for_me: true,
        is_my_bookmark: false
    },
    null,
];

const PRELOAD_PX = 1200 // 読み込み距離（viewport 下にどれだけ余裕があれば追加するか）
const MAX_APPEND_PER_DRAIN = 6 // 1回のdrainで詰め込む最大件数

// dummyFetchNext が本番のfetch処理をシミュレートできるように signal 対応に
const abortableDelay = (ms: number, signal: AbortSignal) =>
    new Promise<void>((resolve, reject) => {
        const t = setTimeout(resolve, ms);
        const onAbort = () => { clearTimeout(t); reject(new DOMException('Aborted', 'AbortError')); };
        if (signal.aborted) onAbort();
        signal.addEventListener('abort', onAbort, { once: true });
    });


const VoicesHomeAll: React.FC = () => {
    // 画面サイズの判定
    const isWideScreen = useIsWideScreen();

    // 投稿の状態管理（PC: 2カラム, モバイル: 1カラム）
    const [leftPosts, setLeftPosts] = useState<VoicesProps[]>([])
    const [rightPosts, setRightPosts] = useState<VoicesProps[]>([])
    const [centerPosts, setCenterPosts] = useState<VoicesProps[]>([])

    // 各カラムのDOM参照
    const containerRef = useRef<HTMLDivElement | null>(null)
    const leftColRef = useRef<HTMLDivElement | null>(null)
    const rightColRef = useRef<HTMLDivElement | null>(null)
    const centerColRef = useRef<HTMLDivElement | null>(null)
    const bottomSentinelRef = useRef<HTMLDivElement | null>(null)

    // Observer
    const ioRef = useRef<IntersectionObserver | null>(null)
    const roRef = useRef<ResizeObserver | null>(null)
    const roTargetRef = useRef<Element | null>(null)

    // サーバデータ
    const serverDataRef = useRef<(VoicesApiProps | null)[]>([...sampleVoices])
    const hasMoreRef = useRef(true)
    const loadedMasterRef = useRef<VoicesProps[]>([]) // すでに読み込んだ投稿の一次情報（順序保持）

    // 競合防止
    const inflightRef = useRef(false)
    const destroyedRef = useRef(false)
    const drainControllerRef = useRef<AbortController | null>(null);

    // カラムの高さを取得
    const getColHeight = (el: HTMLDivElement | null): number => {
        if (!el) return 0
        const rect = el.getBoundingClientRect()
        const lastChild = el.lastElementChild as HTMLElement | null
        return lastChild ? lastChild.getBoundingClientRect().bottom - rect.top : 0
    }

    // センチネル近辺か判別
    const isNearBottom = (): boolean => {
        const s = bottomSentinelRef.current
        if (!s) return false
        const top = s.getBoundingClientRect().top
        const vh = window.innerHeight
        return top - vh < PRELOAD_PX
    }

    // fetchのダミー
    const dummyFetchNext = useCallback(async (signal: AbortSignal): Promise<VoicesProps | null> => {
        await abortableDelay(1000, signal);
        if (!hasMoreRef.current) return null;
        const raw = serverDataRef.current.shift();
        if (raw === undefined) return null;
        if (raw === null) { hasMoreRef.current = false; return null; }
        return convertVoicesProps(raw);
    }, []);

    // 投稿を配分(PC用)
    const appendToPC = useCallback((post: VoicesProps) => {
        const lh = getColHeight(leftColRef.current);
        const rh = getColHeight(rightColRef.current);
        (lh <= rh ? setLeftPosts : setRightPosts)(prev => [...prev, post]);
    }, []);

    // 投稿を配分(モバイル用)
    const appendToMobile = useCallback((post: VoicesProps) => {
        setCenterPosts(prev => [...prev, post])
    }, [])

    // 条件を満たす限り、最大 N 件まで一気に追加
    const drain = useCallback(async () => {
        if (inflightRef.current) return
        inflightRef.current = true

        // 以前のdrainが生きていれば中断
        drainControllerRef.current?.abort();
        const controller = new AbortController();
        drainControllerRef.current = controller;

        try {
            let appended = 0;
            while (!destroyedRef.current && isNearBottom() && hasMoreRef.current && appended < MAX_APPEND_PER_DRAIN) {
                const next = await dummyFetchNext(controller.signal);
                if (!next) break;
                loadedMasterRef.current.push(next);
                (isWideScreen ? appendToPC : appendToMobile)(next);
                appended += 1;
                await new Promise(requestAnimationFrame);
            }
        } catch {
            // AbortError は意図された正しい挙動なので握りつぶす
        } finally {
            if (drainControllerRef.current === controller) drainControllerRef.current = null;
            inflightRef.current = false;
        }
    }, [appendToMobile, appendToPC, dummyFetchNext, isWideScreen])

    // 初期ロード & 追い読み
    useEffect(() => {
        if (isWideScreen === null) return;
        destroyedRef.current = false;

        //IO
        if (!ioRef.current && bottomSentinelRef.current) {
            ioRef.current = new IntersectionObserver(
                entries => { if (entries.some(e => e.isIntersecting)) drain(); },
                { root: null, rootMargin: `${PRELOAD_PX}px 0px`, threshold: 0 }
            );
            ioRef.current.observe(bottomSentinelRef.current);
        }

        // RO
        const roTarget = containerRef.current;
        if (!roRef.current && roTarget) {
            roRef.current = new ResizeObserver(() => {
                requestAnimationFrame(() => { if (!inflightRef.current) drain(); });
            });
            roRef.current.observe(roTarget);
            roTargetRef.current = roTarget;
        }

        // scroll / resize フォールバック
        let ticking = false;
        const onScroll = () => {
            if (ticking) return; ticking = true;
            requestAnimationFrame(() => { ticking = false; drain(); });
        };
        window.addEventListener('scroll', onScroll, { passive: true });

        let tickingResize = false;
        const onResize = () => {
            if (tickingResize) return; tickingResize = true;
            requestAnimationFrame(() => { tickingResize = false; drain(); });
        };
        window.addEventListener('resize', onResize, { passive: true });

        // 初期分を埋める
        (async () => {
            const controller = new AbortController();
            try {
                for (let i = 0; i < MAX_APPEND_PER_DRAIN * 2; i++) {
                    if (!isNearBottom() && (leftPosts.length + rightPosts.length + centerPosts.length) > 0) break;
                    if (!hasMoreRef.current) break;
                    const next = await dummyFetchNext(controller.signal);
                    if (!next) break;
                    loadedMasterRef.current.push(next);
                    (isWideScreen ? appendToPC : appendToMobile)(next);
                    await new Promise(requestAnimationFrame);
                }

                //念のため
                await drain();
            } catch {
                // AbortError は意図された正しい挙動なので握りつぶす
            }
        })();

        return () => {
            destroyedRef.current = true
            window.removeEventListener('scroll', onScroll)
            if (ioRef.current) {
                ioRef.current.disconnect()
                ioRef.current = null
            }
            if (roRef.current) {
                const t = roTargetRef.current
                if (t) roRef.current.unobserve(t)
                roRef.current.disconnect()
                roRef.current = null
                roTargetRef.current = null
            }
            if (drainControllerRef.current) {
                drainControllerRef.current.abort();
                drainControllerRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isWideScreen])

    // レイアウト切替時の再配置
    useEffect(() => {
        if (isWideScreen === null) return
        // 既に読み込んだ投稿一覧を基に、UI の state を作り直す
        if (isWideScreen) {
            // 2カラム（現時点の分はとりあえず交互に配る）
            const L: VoicesProps[] = []
            const R: VoicesProps[] = []
            loadedMasterRef.current.forEach((p, i) => (i % 2 === 0 ? L.push(p) : R.push(p)))
            setCenterPosts([])
            setLeftPosts(L)
            setRightPosts(R)
        } else {
            // 1カラム
            setLeftPosts([])
            setRightPosts([])
            setCenterPosts([...loadedMasterRef.current])
        }
        requestAnimationFrame(() => drain())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isWideScreen])

    return (
        <>
            <div className={styles.voices_home_all_wrapper}>
                {isWideScreen === null ? null : isWideScreen ? (
                    <div className={styles.contents_layout_container_pc}>
                        <div className={styles.contents_layout_left} ref={leftColRef}>
                            {leftPosts.map(p => (
                                <VoicesCard key={p.voicesId} voices={p} />
                            ))}
                        </div>


                        <div className={styles.contents_layout_right} ref={rightColRef}>
                            <VoicesTrendCard />
                            {rightPosts.map(p => (
                                <VoicesCard key={p.voicesId} voices={p} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className={styles.contents_layout_container_mobile}>
                        <div className={styles.contents_layout_center} ref={centerColRef}>
                            {centerPosts.map(p => (
                                <VoicesCard key={p.voicesId} voices={p} />
                            ))}
                        </div>
                    </div>
                )}

                {hasMoreRef.current && (
                    <div ref={bottomSentinelRef}></div>
                )}
            </div>
        </>
    )
};

export default VoicesHomeAll;