//EyesTalkContentsFooterコンポーネントを作成

import { EyesTalkProps } from "src/types";
import styles from 'src/styles/EyesTalkContentsFooter.module.css'
import { useRef, useState, useEffect, useId } from 'react'
import { useRouter } from "next/router";
import Image from "next/image";
import type { BackendResult } from "src/types";
import { validateTextRealTime } from "src/utils/validators";
import { messageSchema, type MessageSchemaInput, MESSAGE_ALLOWED_MIME, MAX_FILE_BYTES, MAX_MESSAGE_FILES, MAX_MESSAGE_TEXT_LETTERS } from "src/utils/schemas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons"
import { faFaceSmile } from "@fortawesome/free-regular-svg-icons"


type CurrentTalkProps = {
    talk: EyesTalkProps | null | undefined;
};

// バックエンドのレスポンスの型定義
type MessageData = { message_id: string };
type MessageErrors = {
    text?: string;
    files?: string;
    processing?: string;
};  //フロント側でも利用
type MessageBackendResult = BackendResult<MessageData, MessageErrors>;

// フローの各ステージ
type FlowResult =
    | { stage: "front_validation"; errors: MessageErrors }
    | { stage: "backend_validation"; errors: MessageErrors }
    | { stage: "sent"; data: MessageData };

// フロントエンドバリデーション関数
const validateFront = (input: MessageSchemaInput): FlowResult | null => {
    const result = messageSchema.safeParse(input);
    if (result.success) return null;

    const errs: MessageErrors = {};
    for (const issue of result.error.issues) {
        const path = issue.path.join(".");
        if (path === "text") errs.text = issue.message;
        else if (path.startsWith("files")) errs.files = issue.message; // 配列なので startsWith
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
    input: MessageSchemaInput,
    signal: AbortSignal
): Promise<MessageBackendResult> => {
    await abortableDelay(1000, signal);

    const errors: MessageErrors = {};
    const result = messageSchema.safeParse(input);
    if (result.success) return { success: true, data: { message_id: "1" } };

    for (const issue of result.error.issues) {
        const path = issue.path.join(".");
        if (path === "text") errors.text = issue.message;
        else if (path.startsWith("files")) errors.files = issue.message;
    }
    return { success: false, errors: errors };
};

// 処理フロー
const messageFlow = async (input: MessageSchemaInput, signal: AbortSignal): Promise<FlowResult> => {
    const front = validateFront(input);
    if (front) return front;
    const back = await dummyBackendProcess(input, signal);
    if (back.success) return { stage: "sent", data: back.data };
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
const loadImageSize = (url: string): Promise<{ w: number; h: number }> => {
    return new Promise((resolve, reject) => {
        if (typeof window === "undefined") {
            reject(new Error("no-window"));
            return;
        }
        const img = new window.Image();
        img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
        img.onerror = reject;
        img.src = url;
    });
};


const EyesTalkContentsFooter: React.FC<CurrentTalkProps> = ({ talk }) => {
    // ルーター
    const router = useRouter();

    // 進行管理
    const [isSubmitting, setIsSubmitting] = useState(false);
    const controllerRef = useRef<AbortController | null>(null);
    useEffect(() => () => controllerRef.current?.abort(), []);

    // 入力
    const [inputFiles, setInputFiles] = useState<(File | null)[]>(Array(MAX_MESSAGE_FILES).fill(null));
    const [inputText, setInputText] = useState("");

    // 画像プレビュー
    const [previewUrls, setPreviewUrls] = useState<(string | null)[]>(Array(MAX_MESSAGE_FILES).fill(null));
    const previewUrlsRef = useRef<(string | null)[]>([]);
    useEffect(() => { previewUrlsRef.current = previewUrls; }, [previewUrls]);

    // 画像の自然比（intrinsic）
    const [imgRatios, setImgRatios] = useState<Array<{ w: number; h: number } | null>>(Array(MAX_MESSAGE_FILES).fill(null));

    // エラー表示
    const [filesError, setFilesError] = useState("");
    const [textError, setTextError] = useState("");
    const [processingError, setProcessingError] = useState("");

    // エラー発生時のフォーカス用
    const textRef = useRef<HTMLTextAreaElement | null>(null);
    const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const imgWrapRefs = useRef<(HTMLDivElement | null)[]>([]);

    // A11y: 動的ID（aria-describedby用）
    const filesErrId = useId();
    const textErrId = useId();

    // アンマウント時に残URLをrevoke
    useEffect(() => {
        return () => {
            previewUrlsRef.current.forEach(u => { if (u) URL.revokeObjectURL(u); });
        };
    }, []);

    // リアルタイムバリデーション
    const handleInputTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputText(validateTextRealTime(e.target.value, MAX_MESSAGE_TEXT_LETTERS));
        setTextError("");
        setProcessingError("");
    };

    // 画像追加ボタン
    const clickFileButton = (index: number) => {
        const input = fileInputRefs.current[index];
        if (!input) return;
        input.value = ""; // 同一ファイル再選択でも onChange を確実に発火させるため
        input.click();
    };

    // 画像アップロード（サイズ/シグネチャ検査→OKならURL/比を更新、NG時はスロットをクリア＆revoke）
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const f = e.target.files?.[0] ?? null;
        if (!f) { return; } // キャンセル

        // サイズ
        if (f.size > MAX_FILE_BYTES) {
            setFilesError("file_too_large");
            setPreviewUrls(prev => {
                const next = [...prev];
                if (next[index]) URL.revokeObjectURL(next[index]!);
                next[index] = null;
                return next;
            });
            setInputFiles(prev => {
                const next = [...prev];
                next[index] = null;
                return next;
            });
            setImgRatios(prev => {
                const next = [...prev];
                next[index] = null;
                return next;
            });
            return;
        }

        // シグネチャ（偽装対策）
        const sig = await sniffImage(f);
        const ok = Array.isArray(MESSAGE_ALLOWED_MIME)
            ? MESSAGE_ALLOWED_MIME.includes(sig)
            : (MESSAGE_ALLOWED_MIME as Set<string>).has(sig);
        if (!ok) {
            setFilesError("file_type_not_allowed");
            setPreviewUrls(prev => {
                const next = [...prev];
                if (next[index]) URL.revokeObjectURL(next[index]!);
                next[index] = null;
                return next;
            });
            setInputFiles(prev => {
                const next = [...prev];
                next[index] = null;
                return next;
            });
            setImgRatios(prev => {
                const next = [...prev];
                next[index] = null;
                return next;
            });
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
        setInputFiles(prev => {
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
            setInputFiles(prev => {
                const next = [...prev];
                next[index] = null;
                return next;
            });
            setImgRatios(prev => {
                const next = [...prev];
                next[index] = null;
                return next;
            });
            setFilesError("image_invalid");
        }

        setFilesError("");
        setProcessingError("");
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
        setInputFiles(prev => {
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
        setFilesError("");
        setProcessingError("");
    };

    // 現在のファイル数を数える
    const countFiles = () => inputFiles.filter((f): f is File => !!f).length;
    const n = countFiles();

    // エラー表示ユーティリティ
    const applyFieldErrors = (e: MessageErrors) => {
        setTextError(e.text ?? "");
        setFilesError(e.files ?? "");
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
            const files = inputFiles.filter((f): f is File => !!f);

            const input: MessageSchemaInput = {
                text: compactText ? compactText : undefined,
                files, // 0..MAX_VOICES_IMAGES
            };

            const res = await messageFlow(input, controller.signal);
            if (controller.signal.aborted) return;

            switch (res.stage) {
                case "front_validation":
                    applyFieldErrors(res.errors);
                    return;
                case "backend_validation":
                    applyFieldErrors(res.errors);
                    return;
                case "sent":
                    // 正常終了：全てリセット（URLもrevoke）
                    previewUrls.forEach(u => { if (u) URL.revokeObjectURL(u); });
                    setInputFiles(Array(MAX_MESSAGE_FILES).fill(null));
                    setPreviewUrls(Array(MAX_MESSAGE_FILES).fill(null));
                    setImgRatios(Array(MAX_MESSAGE_FILES).fill(null));
                    setInputText("");
                    setTextError("");
                    setFilesError("");
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
            {talk === undefined ? (
                <div className={styles.loader_background}>
                </div>
            ) : talk === null ? (
                <div className={styles.error_background}>
                </div>
            ) : (
                <form className={styles.eyes_talk_contents_footer_wrapper} onSubmit={handleSubmit} aria-busy={isSubmitting}>
                    <button
                        type="button"
                        className={styles.file_add_btn}
                        onClick={() => clickFileButton(0)}
                        aria-describedby={filesError ? filesErrId : undefined}
                    >
                        <span>
                            <FontAwesomeIcon icon={faPlus} />
                        </span>

                        <input
                            ref={el => { fileInputRefs.current[0] = el; }}
                            type="file"
                            accept=".jpeg,.jpg,.png,.gif"
                            onChange={(e) => handleFileUpload(e, 0)}
                            style={{ display: "none" }}
                        />
                    </button>

                    <div className={styles.canvas}>
                        <div className={styles.message_contents_wrapper}>
                            {textError || filesError || processingError && (
                                <div className={styles.errors_wrapper}>
                                    {textError ? (
                                        <span id={textErrId} className={styles.text_error_message} role="alert" aria-live="assertive">
                                            {textError}
                                        </span>
                                    ) : filesError ? (
                                        <span id={filesErrId} className={styles.file_error_message} role="alert" aria-live="assertive">
                                            {filesError}
                                        </span>
                                    ) : processingError ? (
                                        <span className={styles.processing_error_message} role="alert" aria-live="assertive">
                                            {processingError}
                                        </span>
                                    ) : null}
                                </div>
                            )}

                            <div className={styles.image_background}>
                                {n === 1 && previewUrls[0] && imgRatios[0] && (
                                    <div className={styles.image_layout1}>
                                        <div className={styles.image_slot} ref={el => { imgWrapRefs.current[0] = el; }}>
                                            <Img idx={0} />

                                            <button type="button" className={styles.delete_btn} onClick={() => handleDeleteFile(0)} aria-label="画像を削除">
                                                <FontAwesomeIcon icon={faXmark} />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {n === 2 && previewUrls[0] && imgRatios[0] && previewUrls[1] && imgRatios[1] && (
                                    <div className={styles.image_layout2}>
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
                                )}

                                {n === 3 && previewUrls[0] && imgRatios[0] && previewUrls[1] && imgRatios[1] && previewUrls[2] && imgRatios[2] && (
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

                                            <div className={styles.image_slot} ref={el => { imgWrapRefs.current[2] = el; }}>
                                                <Img idx={2} />

                                                <button type="button" className={styles.delete_btn} onClick={() => handleDeleteFile(2)} aria-label="画像を削除">
                                                    <FontAwesomeIcon icon={faXmark} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {n === 4 && previewUrls[0] && imgRatios[0] && previewUrls[1] && imgRatios[1] && previewUrls[2] && imgRatios[2] && previewUrls[3] && imgRatios[3] && (
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

                            <textarea
                                ref={textRef}
                                className={styles.text_placeholder}
                                placeholder="テキストを入力"
                                maxLength={MAX_MESSAGE_TEXT_LETTERS}
                                value={inputText}
                                onChange={handleInputTextChange}
                                readOnly={isSubmitting}
                                aria-invalid={!!textError}
                                aria-describedby={textError ? textErrId : undefined}
                            />
                        </div>

                        <button className={styles.pictograph_btn}><FontAwesomeIcon icon={faFaceSmile} /></button>

                        <div className={styles.bar}></div>

                        <button className={styles.send_btn} type="submit" disabled={isSubmitting} aria-disabled={isSubmitting}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 664 663">
                                <path
                                    fill="none"
                                    d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
                                ></path>
                                <path
                                    stroke-linejoin="round"
                                    stroke-linecap="round"
                                    stroke-width="33.67"
                                    stroke="#6c6c6c"
                                    d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
                                ></path>
                            </svg>
                        </button>
                    </div>
                </form>
            )}
        </>
    )
};

export default EyesTalkContentsFooter;