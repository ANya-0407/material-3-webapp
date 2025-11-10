//VoicesFormコンポーネントを作成

import styles from 'src/styles/VoicesForm.module.css'
import React, { useRef, useState, useEffect, useId } from 'react'
import { useRouter } from "next/router";
import Image from "next/image";
import type { BackendResult } from "src/types";
import { validateTextRealTime } from "src/utils/validators";
import { voicesSchema, type VoicesSchemaInput, VOICES_ALLOWED_MIME, MAX_IMAGE_BYTES, MAX_VOICES_IMAGES, MAX_VOICES_TEXT_LETTERS } from "src/utils/schemas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faXmark, faGear } from "@fortawesome/free-solid-svg-icons"


type VoicesFormProps = { quotedVoicesId?: string | null };

// バックエンドのレスポンスの型定義
type VoicesData = { voices_id: string };
type VoicesErrors = {
    text?: string;
    images?: string;
    processing?: string;
};  //フロント側でも利用
type VoicesBackendResult = BackendResult<VoicesData, VoicesErrors>;

// フローの各ステージ
type FlowResult =
    | { stage: "front_validation"; errors: VoicesErrors }
    | { stage: "backend_validation"; errors: VoicesErrors }
    | { stage: "posted"; data: VoicesData };

// フロントエンドバリデーション関数
const validateFront = (input: VoicesSchemaInput): FlowResult | null => {
    const result = voicesSchema.safeParse(input);
    if (result.success) return null;

    const errs: VoicesErrors = {};
    for (const issue of result.error.issues) {
        const path = issue.path.join(".");
        if (path === "text") errs.text = issue.message;
        else if (path.startsWith("images")) errs.images = issue.message;
    }
    return { stage: "front_validation", errors: errs };
};

// dummyBackendProcess が本番のfetch処理をシミュレートできるように signal 対応に
const abortableDelay = (ms: number, signal: AbortSignal) =>
    new Promise<void>((resolve, reject) => {
        const t = setTimeout(resolve, ms);
        const onAbort = () => { clearTimeout(t); reject(new DOMException("Aborted", "AbortError")); };
        if (signal.aborted) onAbort();
        signal.addEventListener("abort", onAbort, { once: true });
    });

// バックエンド処理のダミー（フロント側のfetchと、fetch先のバックエンド処理を便宜的に統合したもの）
const dummyBackendProcess = async (
    input: VoicesSchemaInput,
    signal: AbortSignal
): Promise<VoicesBackendResult> => {
    await abortableDelay(1000, signal);

    const errors: VoicesErrors = {};
    const result = voicesSchema.safeParse(input);
    if (result.success) return { success: true, data: { voices_id: "1" } };

    for (const issue of result.error.issues) {
        const path = issue.path.join(".");
        if (path === "text") errors.text = issue.message;
        else if (path.startsWith("images")) errors.images = issue.message;
    }
    return { success: false, errors: errors };
};

// 処理フロー
const voicesFlow = async (input: VoicesSchemaInput, signal: AbortSignal): Promise<FlowResult> => {
    const front = validateFront(input);
    if (front) return front;
    const back = await dummyBackendProcess(input, signal);
    if (back.success) return { stage: "posted", data: back.data };
    return { stage: "backend_validation", errors: back.errors };
};

// シグネチャsniff（MIME 偽装の簡易検知）
const sniffImage = async (
    file: File
): Promise<"image/jpeg" | "image/png" | "image/gif" | "unknown"> => {
    const head = new Uint8Array(await file.slice(0, 24).arrayBuffer());
    const tail = new Uint8Array(await file.slice(Math.max(0, file.size - 2), file.size).arrayBuffer());

    // JPEG: SOI(FFD8) && EOI(FFD9)
    if (head[0] === 0xFF && head[1] === 0xD8 && tail[0] === 0xFF && tail[1] === 0xD9) {
        return "image/jpeg";
    }
    // PNG: 署名 + IHDR
    if (
        head[0] === 0x89 && head[1] === 0x50 && head[2] === 0x4E && head[3] === 0x47 &&
        head[4] === 0x0D && head[5] === 0x0A && head[6] === 0x1A && head[7] === 0x0A &&
        head[12] === 0x49 && head[13] === 0x48 && head[14] === 0x44 && head[15] === 0x52
    ) {
        return "image/png";
    }
    // GIF: "GIF87a" or "GIF89a"
    if (
        head[0] === 0x47 && head[1] === 0x49 && head[2] === 0x46 &&
        head[3] === 0x38 && (head[4] === 0x37 || head[4] === 0x39) && head[5] === 0x61
    ) {
        return "image/gif";
    }

    return "unknown";
};

// 画像の自然サイズを取得（縦固定・横可変の算出で使用）
const loadImageSize = (url: string) =>
    new Promise<{ w: number; h: number }>((resolve, reject) => {
        if (typeof window === 'undefined') { reject(new Error('no-window')); return; }
        const img = new window.Image();
        img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
        img.onerror = reject;
        img.src = url;
    });


const VoicesForm: React.FC<VoicesFormProps> = ({ quotedVoicesId }) => {
    // ルーター
    const router = useRouter();

    // 進行管理
    const [isSubmitting, setIsSubmitting] = useState(false);
    const controllerRef = useRef<AbortController | null>(null);
    useEffect(() => () => controllerRef.current?.abort(), []);

    // 入力
    const [inputImages, setInputImages] = useState<(File | null)[]>(Array(MAX_VOICES_IMAGES).fill(null));
    const [inputText, setInputText] = useState("");

    // 画像プレビュー
    const [previewUrls, setPreviewUrls] = useState<(string | null)[]>(Array(MAX_VOICES_IMAGES).fill(null));
    const previewUrlsRef = useRef<(string | null)[]>([]);
    useEffect(() => { previewUrlsRef.current = previewUrls; }, [previewUrls]);

    // 画像の自然比（intrinsic）
    const [imgRatios, setImgRatios] = useState<Array<{ w: number; h: number } | null>>(Array(MAX_VOICES_IMAGES).fill(null));

    // エラー表示
    const [imagesError, setImagesError] = useState("");
    const [textError, setTextError] = useState("");
    const [processingError, setProcessingError] = useState("");

    // エラー発生時のフォーカス用
    const textRef = useRef<HTMLTextAreaElement | null>(null);
    const imageInputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const imgWrapRefs = useRef<(HTMLDivElement | null)[]>([]);

    // A11y: 動的ID（aria-describedby用）
    const imagesErrId = useId();
    const textErrId = useId();

    // 画像追加ボタン
    const [isHovered, setIsHovered] = useState(false);

    // アンマウント時に残URLをrevoke
    useEffect(() => {
        return () => {
            previewUrlsRef.current.forEach(u => { if (u) URL.revokeObjectURL(u); });
        };
    }, []);

    // リアルタイムバリデーション
    const handleInputTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputText(validateTextRealTime(e.target.value, MAX_VOICES_TEXT_LETTERS));
        setTextError("");
        setProcessingError("");
    };

    // 画像追加ボタン
    const clickFileButton = (index: number) => {
        const input = imageInputRefs.current[index];
        if (!input) return;
        input.value = ""; // 同一ファイル再選択でも onChange を確実に発火させるため
        input.click();
    };

    // 画像アップロード（サイズ/シグネチャ検査→OKならURL/比を更新、NG時はスロットをクリア＆revoke）
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const f = e.target.files?.[0] ?? null;
        if (!f) { return; } // キャンセル

        // サイズ
        if (f.size > MAX_IMAGE_BYTES) {
            setImagesError("image_too_large");
            setPreviewUrls(prev => {
                const next = [...prev];
                if (next[index]) URL.revokeObjectURL(next[index]!);
                next[index] = null;
                return next;
            });
            setInputImages(prev => {
                const next = [...prev];
                next[index] = null;
                return next;
            });
            setImgRatios(prev => {
                const next = [...prev];
                next[index] = null;
                return next;
            });
            setIsHovered(false);
            return;
        }

        // シグネチャ（偽装対策）
        const sig = await sniffImage(f);
        const ok = Array.isArray(VOICES_ALLOWED_MIME)
            ? VOICES_ALLOWED_MIME.includes(sig)
            : (VOICES_ALLOWED_MIME as Set<string>).has(sig);
        if (!ok) {
            setImagesError("image_type_not_allowed");
            setPreviewUrls(prev => {
                const next = [...prev];
                if (next[index]) URL.revokeObjectURL(next[index]!);
                next[index] = null;
                return next;
            });
            setInputImages(prev => {
                const next = [...prev];
                next[index] = null;
                return next;
            });
            setImgRatios(prev => {
                const next = [...prev];
                next[index] = null;
                return next;
            });
            setIsHovered(false);
            return;
        }

        // OK: URL差し替え
        const nextUrl = URL.createObjectURL(f);
        setPreviewUrls(prev => {
            const next = [...prev];
            if (next[index]) URL.revokeObjectURL(next[index]!);
            next[index] = nextUrl;
            return next;
        });
        setInputImages(prev => {
            const next = [...prev];
            next[index] = f;
            return next;
        });

        // 自然比の保存（intrinsic）
        try {
            const currentUrl = nextUrl;
            const { w, h } = await loadImageSize(currentUrl);
            // レース対策：最新URLでなければ破棄
            if (previewUrlsRef.current[index] !== currentUrl) {
                URL.revokeObjectURL(currentUrl);
                return;
            }
            setImgRatios(prev => {
                const next = [...prev];
                next[index] = { w, h };
                return next;
            });
        } catch {
            // 画像の読み込みに失敗した場合は該当スロットをクリア
            setPreviewUrls(prev => {
                const next = [...prev];
                if (next[index]) URL.revokeObjectURL(next[index]!);
                next[index] = null;
                return next;
            });
            setInputImages(prev => {
                const next = [...prev];
                next[index] = null;
                return next;
            });
            setImgRatios(prev => {
                const next = [...prev];
                next[index] = null;
                return next;
            });
            setImagesError("image_invalid");
        }

        setImagesError("");
        setProcessingError("");
        setIsHovered(false);
    };

    // 画像削除ボタン
    const handleDeleteFile = (index: number) => {
        setPreviewUrls(prev => {
            const arr = [...prev];
            if (arr[index]) URL.revokeObjectURL(arr[index]!);
            arr.splice(index, 1);
            arr.push(null);
            return arr;
        });
        setInputImages(prev => {
            const arr = [...prev];
            arr.splice(index, 1);
            arr.push(null);
            return arr;
        });
        setImgRatios(prev => {
            const arr = [...prev];
            arr.splice(index, 1);
            arr.push(null);
            return arr;
        });
        setImagesError("");
        setProcessingError("");
        setIsHovered(false);
    };

    // 現在の登録枚数を数える
    const countImages = () => inputImages.filter((f): f is File => !!f).length;
    const n = countImages();

    // エラー表示ユーティリティ
    const applyFieldErrors = (e: VoicesErrors) => {
        setTextError(e.text ?? "");
        setImagesError(e.images ?? "");
        setProcessingError(e.processing ?? "");
        if (e.text) { textRef.current?.focus(); return; }
    };

    // Submit時の処理
    const handleSubmit = async (ev?: React.FormEvent) => {
        ev?.preventDefault();
        if (isSubmitting) return;

        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;

        try {
            setIsSubmitting(true);
            applyFieldErrors({}); // 一旦リセット

            const compactText = inputText.trim();
            const images = inputImages.filter((f): f is File => !!f);

            const input: VoicesSchemaInput = {
                text: compactText ? compactText : undefined,
                images, // 0..MAX_VOICES_IMAGES
            };

            const res = await voicesFlow(input, controller.signal);
            if (controller.signal.aborted) return;

            switch (res.stage) {
                case "front_validation":
                    applyFieldErrors(res.errors);
                    return;
                case "backend_validation":
                    applyFieldErrors(res.errors);
                    return;
                case "posted":
                    // 正常終了：全てリセット（URLもrevoke）
                    previewUrls.forEach(u => { if (u) URL.revokeObjectURL(u); });
                    setInputImages(Array(MAX_VOICES_IMAGES).fill(null));
                    setPreviewUrls(Array(MAX_VOICES_IMAGES).fill(null));
                    setImgRatios(Array(MAX_VOICES_IMAGES).fill(null));
                    setInputText("");
                    setTextError("");
                    setImagesError("");
                    setProcessingError("");
                    router.push("/eyeshome");
                    return;
                default: {
                    const _exhaustive: never = res;
                    return _exhaustive;
                }
            }
        } catch (err: unknown) {
            // 意図された中断
            if (err instanceof DOMException && err.name === "AbortError") return;
            setProcessingError("processing_error");
        } finally {
            setIsSubmitting(false);
        }
    };

    // 画像Image要素
    const Img = ({ idx }: { idx: number }) => {
        const url = previewUrls[idx]!;
        return (
            <Image
                className={styles.image_preview}
                src={url}
                alt={`Preview ${idx + 1}`}
                fill
                unoptimized
                style={{ objectFit: "cover", objectPosition: "center" }}
                priority={false}
            />
        );
    };

    return (
        <>
            <form className={styles.voices_form_wrapper} onSubmit={handleSubmit} aria-busy={isSubmitting}>
                <div className={styles.form_header}>
                    <span>Voices を投稿</span>

                    <button type="button" className={styles.schedule_btn}>スケジュール</button>
                </div>

                <div className={styles.form_contents}>
                    <div>{quotedVoicesId}</div>

                    {textError && (
                        <span id={textErrId} className={styles.text_error_message} role="alert" aria-live="assertive">{textError}</span>
                    )}

                    <textarea
                        ref={textRef}
                        className={styles.text_placeholder}
                        placeholder="テキストを入力"
                        maxLength={MAX_VOICES_TEXT_LETTERS}
                        value={inputText}
                        onChange={handleInputTextChange}
                        readOnly={isSubmitting}
                        aria-invalid={!!textError}
                        aria-describedby={textError ? textErrId : undefined}
                    />

                    {imagesError && (
                        <span id={imagesErrId} className={styles.image_error_message} role="alert" aria-live="assertive">{imagesError}</span>
                    )}

                    <div className={styles.image_background}>
                        {n === 0 && (
                            <div className={styles.image_layout1}>
                                <div className={styles.image_slot_empty}>
                                    <button
                                        type="button"
                                        className={styles.upload_btn}
                                        onClick={() => clickFileButton(0)}
                                        onMouseEnter={() => setIsHovered(true)}
                                        onMouseLeave={() => setIsHovered(false)}
                                        aria-describedby={imagesError ? imagesErrId : undefined}
                                    >
                                        <span style={{ transition: 'transform 0.3s ease', transform: isHovered ? 'rotate(-45deg)' : 'none' }}>
                                            <FontAwesomeIcon icon={faPlus} />
                                        </span>
                                    </button>

                                    <input
                                        ref={el => { imageInputRefs.current[0] = el; }}
                                        type="file"
                                        accept=".jpeg,.jpg,.png,.gif"
                                        onChange={(e) => handleFileUpload(e, 0)}
                                        style={{ display: "none" }}
                                    />
                                </div>
                            </div>
                        )}

                        {n === 1 && previewUrls[0] && imgRatios[0] && (
                            <div className={styles.image_layout2}>
                                <div className={styles.image_slot} ref={el => { imgWrapRefs.current[0] = el; }}>
                                    <Img idx={0} />

                                    <button type="button" className={styles.delete_btn} onClick={() => handleDeleteFile(0)} aria-label="画像を削除">
                                        <FontAwesomeIcon icon={faXmark} />
                                    </button>
                                </div>

                                <div className={styles.image_slot_empty}>
                                    <button
                                        type="button"
                                        className={styles.upload_btn}
                                        onClick={() => clickFileButton(1)}
                                        onMouseEnter={() => setIsHovered(true)}
                                        onMouseLeave={() => setIsHovered(false)}
                                        aria-describedby={imagesError ? imagesErrId : undefined}
                                    >
                                        <span style={{ transition: 'transform 0.3s ease', transform: isHovered ? 'rotate(-45deg)' : 'none' }}>
                                            <FontAwesomeIcon icon={faPlus} />
                                        </span>
                                    </button>

                                    <input
                                        ref={el => { imageInputRefs.current[1] = el; }}
                                        type="file"
                                        accept=".jpeg,.jpg,.png,.gif"
                                        onChange={(e) => handleFileUpload(e, 1)}
                                        style={{ display: "none" }}
                                    />
                                </div>
                            </div>
                        )}

                        {n === 2 && previewUrls[0] && imgRatios[0] && previewUrls[1] && imgRatios[1] && (
                            <div className={styles.image_layout3}>
                                <div className={styles.image_section1}>
                                    <div className={styles.image_slot} ref={el => { imgWrapRefs.current[0] = el; }}>
                                        <Img idx={0} />

                                        <button type="button" className={styles.delete_btn} onClick={() => handleDeleteFile(0)} aria-label="画像を削除">
                                            <FontAwesomeIcon icon={faXmark} />
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.image_section2}>
                                    <div className={styles.image_slot} ref={el => { imgWrapRefs.current[1] = el; }}>
                                        <Img idx={1} />

                                        <button type="button" className={styles.delete_btn} onClick={() => handleDeleteFile(1)} aria-label="画像を削除">
                                            <FontAwesomeIcon icon={faXmark} />
                                        </button>
                                    </div>

                                    <div className={styles.image_slot_empty}>
                                        <button
                                            type="button"
                                            className={styles.upload_btn}
                                            onClick={() => clickFileButton(2)}
                                            onMouseEnter={() => setIsHovered(true)}
                                            onMouseLeave={() => setIsHovered(false)}
                                            aria-describedby={imagesError ? imagesErrId : undefined}
                                        >
                                            <span style={{ transition: 'transform 0.3s ease', transform: isHovered ? 'rotate(-45deg)' : 'none' }}>
                                                <FontAwesomeIcon icon={faPlus} />
                                            </span>
                                        </button>

                                        <input
                                            ref={el => { imageInputRefs.current[2] = el; }}
                                            type="file"
                                            accept=".jpeg,.jpg,.png,.gif"
                                            onChange={(e) => handleFileUpload(e, 2)}
                                            style={{ display: "none" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {n === 3 && previewUrls[0] && imgRatios[0] && previewUrls[1] && imgRatios[1] && previewUrls[2] && imgRatios[2] && (
                            <div className={styles.image_layout4}>
                                <div className={styles.image_section1}>
                                    <div className={styles.image_slot} ref={el => { imgWrapRefs.current[0] = el; }}>
                                        <Img idx={0} />

                                        <button type="button" className={styles.delete_btn} onClick={() => handleDeleteFile(0)} aria-label="画像を削除">
                                            <FontAwesomeIcon icon={faXmark} />
                                        </button>
                                    </div>

                                    <div className={styles.image_slot} ref={el => { imgWrapRefs.current[1] = el; }}>
                                        <Img idx={1} />

                                        <button type="button" className={styles.delete_btn} onClick={() => handleDeleteFile(1)} aria-label="画像を削除">
                                            <FontAwesomeIcon icon={faXmark} />
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.image_section2}>
                                    <div className={styles.image_slot} ref={el => { imgWrapRefs.current[2] = el; }}>
                                        <Img idx={2} />

                                        <button type="button" className={styles.delete_btn} onClick={() => handleDeleteFile(2)} aria-label="画像を削除">
                                            <FontAwesomeIcon icon={faXmark} />
                                        </button>
                                    </div>

                                    <div className={styles.image_slot_empty}>
                                        <button
                                            type="button"
                                            className={styles.upload_btn}
                                            onClick={() => clickFileButton(3)}
                                            onMouseEnter={() => setIsHovered(true)}
                                            onMouseLeave={() => setIsHovered(false)}
                                            aria-describedby={imagesError ? imagesErrId : undefined}
                                        >
                                            <span style={{ transition: 'transform 0.3s ease', transform: isHovered ? 'rotate(-45deg)' : 'none' }}>
                                                <FontAwesomeIcon icon={faPlus} />
                                            </span>
                                        </button>

                                        <input
                                            ref={el => { imageInputRefs.current[3] = el; }}
                                            type="file"
                                            accept=".jpeg,.jpg,.png,.gif"
                                            onChange={(e) => handleFileUpload(e, 3)}
                                            style={{ display: "none" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {n >= 4 && previewUrls[0] && imgRatios[0] && previewUrls[1] && imgRatios[1] && previewUrls[2] && imgRatios[2] && previewUrls[3] && imgRatios[3] && (
                            <div className={styles.image_layout4}>
                                <div className={styles.image_section1}>
                                    <div className={styles.image_slot} ref={el => { imgWrapRefs.current[0] = el; }}>
                                        <Img idx={0} />

                                        <button type="button" className={styles.delete_btn} onClick={() => handleDeleteFile(0)} aria-label="画像を削除">
                                            <FontAwesomeIcon icon={faXmark} />
                                        </button>
                                    </div>

                                    <div className={styles.image_slot} ref={el => { imgWrapRefs.current[1] = el; }}>
                                        <Img idx={1} />

                                        <button type="button" className={styles.delete_btn} onClick={() => handleDeleteFile(1)} aria-label="画像を削除">
                                            <FontAwesomeIcon icon={faXmark} />
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.image_section2}>
                                    <div className={styles.image_slot} ref={el => { imgWrapRefs.current[2] = el; }}>
                                        <Img idx={2} />

                                        <button type="button" className={styles.delete_btn} onClick={() => handleDeleteFile(2)} aria-label="画像を削除">
                                            <FontAwesomeIcon icon={faXmark} />
                                        </button>
                                    </div>

                                    <div className={styles.image_slot} ref={el => { imgWrapRefs.current[3] = el; }}>
                                        <Img idx={3} />

                                        <button type="button" className={styles.delete_btn} onClick={() => handleDeleteFile(3)} aria-label="画像を削除">
                                            <FontAwesomeIcon icon={faXmark} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {processingError && (
                        <span className={styles.processing_error_message} role="alert" aria-live="assertive">{processingError}</span>
                    )}

                    <div className={styles.btn_container}>
                        {isSubmitting ? (
                            <div className={styles.dummy_post_btn}>
                                <div className={styles.loader}></div>
                            </div>
                        ) : (
                            <button className={styles.post_btn_true} type="submit" disabled={isSubmitting} aria-disabled={isSubmitting}>
                                <div></div><span>投稿</span>
                            </button>
                        )}

                        <button type="button"  className={styles.menu_btn} aria-label="メニューを開く">
                            <span><FontAwesomeIcon icon={faGear} /></span>
                        </button>
                    </div>
                </div>
            </form>
        </>
    )
};

export default VoicesForm;