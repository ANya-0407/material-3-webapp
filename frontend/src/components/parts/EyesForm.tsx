//EyesFormコンポーネントを作成

import styles from 'src/styles/EyesForm.module.css'
import React, { useRef, useState, useEffect, useId } from 'react'
import { useRouter } from "next/router";
import Image from "next/image";
import type { BackendResult } from "src/types";
import { validateTextRealTime } from "src/utils/validators";
import { eyesSchema, type EyesSchemaInput, EYES_ALLOWED_MIME, MAX_IMAGE_BYTES, MAX_TAG_LETTERS, MAX_HASHTAG_LETTERS, MAX_HASHTAGS } from "src/utils/schemas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faXmark, faHashtag, faGear } from "@fortawesome/free-solid-svg-icons"


// バックエンドのレスポンスの型定義
type EyesData = { eyes_id: string };
type EyesErrors = {
    tag?: string;
    hashtags?: string;
    image?: string;
    processing?: string
};  //フロント側でも利用
type EyesBackendResult = BackendResult<EyesData, EyesErrors>;

// フローの各ステージ
type FlowResult =
    | { stage: "front_validation"; errors: EyesErrors }
    | { stage: "backend_validation"; errors: EyesErrors }
    | { stage: "posted"; data: EyesData };

// フロントエンドバリデーション関数
const validateFront = (input: EyesSchemaInput): FlowResult | null => {
    const result = eyesSchema.safeParse(input);
    if (result.success) return null;

    const errs: EyesErrors = {};
    for (const issue of result.error.issues) {
        const path = issue.path.join(".");
        if (path === "tag") errs.tag = issue.message;
        else if (path.startsWith("hashtags")) errs.hashtags = issue.message;
        else if (path === "image") errs.image = issue.message;
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
    input: EyesSchemaInput,
    signal: AbortSignal
): Promise<EyesBackendResult> => {
    await abortableDelay(1000, signal);

    const errors: EyesErrors = {};
    const result = eyesSchema.safeParse(input);
    if (result.success) return { success: true, data: { eyes_id: "1" } };

    for (const issue of result.error.issues) {
        const path = issue.path.join(".");
        if (path === "tag") errors.tag = issue.message;
        else if (path.startsWith("hashtags")) errors.hashtags = issue.message;
        else if (path === "image") errors.image = issue.message;
    }
    return { success: false, errors: errors };
};

// 処理フロー
const eyesFlow = async (input: EyesSchemaInput, signal: AbortSignal): Promise<FlowResult> => {
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

// 画像の自然サイズを取得
const loadImageSize = (url: string): Promise<{ w: number; h: number }> => {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined') {
            reject(new Error('no-window'));
            return;
        }
        const img = new window.Image(); // new Image() は引数なしOK
        img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
        img.onerror = reject;
        img.src = url;
    });
};


const EyesForm: React.FC = () => {
    // ルーター
    const router = useRouter();

    // 進行管理
    const [isSubmitting, setIsSubmitting] = useState(false);
    const controllerRef = useRef<AbortController | null>(null);
    useEffect(() => () => controllerRef.current?.abort(), []);

    // 入力
    const [inputImage, setInputImage] = useState<File | null>(null);
    const [inputTag, setInputTag] = useState("");
    const [inputHashtags, setInputHashtags] = useState<string[]>([""]);

    // 画像プレビュー
    const [previewUrl, setPreviewUrl] = useState<string | null>(null) 
    const previewUrlRef = useRef<string | null>(null);
    useEffect(() => { previewUrlRef.current = previewUrl; }, [previewUrl]);

    // 画像の自然比（intrinsic）
    const [imgRatio, setImgRatio] = useState<{ w: number; h: number } | null>(null);

    // エラー表示
    const [imageError, setImageError] = useState("");
    const [tagError, setTagError] = useState("");
    const [hashtagsError, setHashtagsError] = useState("");
    const [processingError, setProcessingError] = useState("");

    // エラー発生時のフォーカス用
    const imageInputRef = useRef<HTMLInputElement | null>(null);
    const tagRef = useRef<HTMLTextAreaElement | null>(null);
    const firstHashtagRef = useRef<HTMLInputElement | null>(null);
    const imgWrapRef = useRef<HTMLDivElement | null>(null);

    // A11y: 動的ID（aria-describedby用）
    const imageErrId = useId();
    const tagErrId = useId();
    const hashtagsErrId = useId();

    // 画像追加ボタン
    const [isHovered, setIsHovered] = useState(false);

    // アンマウント時に残URLをrevoke
    useEffect(() => {
        return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
    }, [previewUrl]);

    // リアルタイムバリデーション
    const handleInputTagChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputTag(validateTextRealTime(e.target.value, MAX_TAG_LETTERS));
        setTagError("");
    };
    const handleInputHashtagChange = (idx: number, v: string) => {
        const next = validateTextRealTime(v, MAX_HASHTAG_LETTERS);
        setInputHashtags((prev) => prev.map((p, i) => (i === idx ? next : p)));
        setHashtagsError("");
    };

    // 画像追加ボタン
    const clickFileButton = () => {
        if (imageInputRef.current) {
            imageInputRef.current.value = ""; // 同一ファイル再選択でも onChange を確実に発火させるため
            imageInputRef.current.click();
        }
    }

    // 画像アップロード（サイズ/シグネチャ検査→URL作成、NG時はスロットをクリア＆既存URL revoke）
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] ?? null;
        if (!f) return;

        // サイズ
        if (f.size > MAX_IMAGE_BYTES) {
            setImageError("image_too_large");
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
            setInputImage(null);
            setImgRatio(null);
            return;
        }

        // シグネチャ（偽装対策）
        const sig = await sniffImage(f);
        const ok = Array.isArray(EYES_ALLOWED_MIME)
            ? EYES_ALLOWED_MIME.includes(sig)
            : (EYES_ALLOWED_MIME as Set<string>).has(sig);
        if (!ok) {
            setImageError("image_type_not_allowed");
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
            setInputImage(null);
            setImgRatio(null);
            return;
        }

        // OK: URL差し替え
        const nextUrl = URL.createObjectURL(f);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(nextUrl);
        setInputImage(f);

        // 自然比を保存（intrinsic）
        try {
            const currentUrl = nextUrl;
            const { w, h } = await loadImageSize(currentUrl);
            // レース対策：最新URLでなければ破棄
            if (previewUrlRef.current !== currentUrl) { 
                URL.revokeObjectURL(currentUrl);
                return;
            }
            setImgRatio({ w, h });
        } catch {
            if (nextUrl) URL.revokeObjectURL(nextUrl);
            setPreviewUrl(null);
            setInputImage(null);
            setImgRatio(null);
            setImageError("image_invalid");
        }

        setImageError("");
        setProcessingError("");
    };

    // 画像削除ボタン
    const handleDeleteFile = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        setInputImage(null);
        setImgRatio(null);
        setImageError("");
        setProcessingError("");
    };

    // エラー表示ユーティリティ
    const applyFieldErrors = (e: EyesErrors) => {
        setTagError(e.tag ?? "");
        setHashtagsError(e.hashtags ?? "");
        setImageError(e.image ?? "");
        setProcessingError(e.processing ?? "");

        if (e.image) { imageInputRef.current?.focus(); return; }
        if (e.tag) { tagRef.current?.focus(); return; }
        if (e.hashtags) { firstHashtagRef.current?.focus(); return; }
    };

    // サブミット時の処理
    const handleSubmit = async (ev?: React.FormEvent) => {
        ev?.preventDefault();
        if (isSubmitting) return;

        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;

        try {
            setIsSubmitting(true);
            applyFieldErrors({}); // 一旦リセット

            const tag = inputTag.trim() || undefined;
            const hashtags = inputHashtags;
            const image = inputImage || undefined;

            const input: EyesSchemaInput = { tag, hashtags, image };

            const res = await eyesFlow(input, controller.signal);
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
                    if (previewUrl) URL.revokeObjectURL(previewUrl);
                    setPreviewUrl(null);
                    setInputImage(null);
                    setImgRatio(null);
                    setInputTag("");
                    setInputHashtags([""]);
                    setTagError("");
                    setHashtagsError("");
                    setImageError("");
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

    return (
        <>
            <form className={styles.eyes_form_wrapper} onSubmit={handleSubmit} aria-busy={isSubmitting}>
                <div className={styles.form_header}>
                    <span>Eyes を投稿</span>

                    <button type="button" className={styles.schedule_btn}>スケジュール</button>
                </div>

                <div className={styles.form_contents}>
                    {imageError && (
                        <span id={imageErrId} className={styles.image_error_message} role="alert" aria-live="assertive">{imageError}</span>
                    )}

                    {inputImage && previewUrl && imgRatio ? (
                        <div className={styles.image_slot} ref={(el) => { imgWrapRef.current = el; }}>
                            <Image
                                className={styles.image_preview}
                                src={previewUrl}
                                alt="Preview"
                                // intrinsic（自然比）— CLS回避
                                width={imgRatio.w}
                                height={imgRatio.h}
                                // 表示サイズ：横はCSSにフィット（100%）、縦は自然比で自動
                                style={{ width: "100%", height: "auto" }}
                                priority={false}
                            />

                            <button type="button" className={styles.delete_btn} onClick={handleDeleteFile} aria-label="画像を削除">
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>
                    ) : (
                        <div className={styles.image_slot_empty}>
                            <button
                                type="button"
                                className={styles.upload_btn}
                                onClick={clickFileButton}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                aria-describedby={imageError ? imageErrId : undefined}
                            >
                                <span style={{ transition: 'transform 0.3s ease', transform: isHovered ? 'rotate(-45deg)' : 'none' }}>
                                    <FontAwesomeIcon icon={faPlus} />
                                </span>
                            </button>

                            <input
                                ref={imageInputRef}
                                type="file"
                                accept=".jpeg,.jpg,.png,.gif"
                                onChange={handleFileUpload}
                                style={{ display: "none" }}
                            />
                        </div>
                    )}

                    {tagError && (
                        <span id={tagErrId} className={styles.tag_error_message} role="alert" aria-live="assertive">{tagError}</span>
                    )}

                    <textarea
                        ref={tagRef}
                        className={styles.tag_placeholder}
                        placeholder="タグ (100文字以内)"
                        maxLength={MAX_TAG_LETTERS}
                        value={inputTag}
                        onChange={handleInputTagChange}
                        readOnly={isSubmitting}
                        aria-invalid={!!tagError}
                        aria-describedby={tagError ? tagErrId : undefined}
                    />

                    <div className={styles.hashtag_wrapper}>
                        <div className={styles.hashtag_tytle_container}>
                            <label className={styles.hashtag_tytle}>ハッシュタグ</label>

                            {hashtagsError && (
                                <span id={hashtagsErrId} className={styles.hashtag_error_message} role="alert" aria-live="assertive">{hashtagsError}</span>
                            )}
                        </div>

                        <div className={styles.hashtag_placeholder_container}>
                            {inputHashtags.map((h, i) => (
                                <div className={styles.hashtag_placeholder} key={i}>
                                    <span><FontAwesomeIcon icon={faHashtag} /></span>

                                    <input
                                        ref={i === 0 ? firstHashtagRef : undefined}
                                        type="text"
                                        placeholder="hashtag"
                                        maxLength={MAX_HASHTAG_LETTERS}
                                        value={h}
                                        onChange={(e) => handleInputHashtagChange(i, e.target.value)}
                                        readOnly={isSubmitting}
                                    />
                                    {i === inputHashtags.length - 1 && inputHashtags.length < MAX_HASHTAGS && (
                                        <button
                                            type="button"
                                            onClick={() => setInputHashtags((prev) => [...prev, ""])}
                                            aria-label="ハッシュタグを追加"
                                        >
                                            <FontAwesomeIcon icon={faPlus} />
                                        </button>
                                    )}
                                    {inputHashtags.length > 1 && (
                                        <button
                                            type="button"
                                            className={styles.delete_hashtag_btn}
                                            onClick={() => setInputHashtags((prev) => {
                                                const next = prev.filter((_, idx) => idx !== i);
                                                return next.length ? next : [""];
                                            })}
                                            aria-label="このハッシュタグを削除"
                                        >
                                            <FontAwesomeIcon icon={faXmark} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
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
                            <button className={styles.post_btn} type="submit" disabled={isSubmitting} aria-disabled={isSubmitting}>
                                <div></div>
                                <span>投稿</span>
                            </button>
                        )}

                        <button type="button" className={styles.menu_btn} aria-label="メニューを開く">
                            <span><FontAwesomeIcon icon={faGear} /></span>
                        </button>
                    </div>
                </div>
            </form>
        </>
    )
};

export default EyesForm;