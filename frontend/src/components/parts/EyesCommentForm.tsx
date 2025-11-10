//EyesCommentFormコンポーネントを作成

import { EyesProps } from "src/types";
import styles from 'src/styles/EyesCommentForm.module.css'
import React, { useRef, useState, useEffect, useId } from 'react'
import type { BackendResult } from "src/types";
import { validateTextRealTime } from "src/utils/validators";
import { eyesCommentSchema, type EyesCommentSchemaInput, MAX_EYES_COMMENT_LETTERS } from "src/utils/schemas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons"


type EyesCommentFormProps = {
    eyes: EyesProps | null | undefined;
    isCommentVisible: boolean;
    onToggle: () => void;
};

// バックエンドのレスポンスの型定義
type EyesCommentData = { eyes_comment_id: string };
type EyesCommentErrors = {
    text?: string;
    processing?: string;
};  //フロント側でも利用
type EyesCommentBackendResult = BackendResult<EyesCommentData, EyesCommentErrors>;

// フローの各ステージ
type FlowResult =
    | { stage: "front_validation"; errors: EyesCommentErrors }
    | { stage: "backend_validation"; errors: EyesCommentErrors }
    | { stage: "posted"; data: EyesCommentData };

// フロントエンドバリデーション関数
const validateFront = (input: EyesCommentSchemaInput): FlowResult | null => {
    const result = eyesCommentSchema.safeParse(input);
    if (result.success) return null;

    const errs: EyesCommentErrors = {};
    for (const issue of result.error.issues) {
        const path = issue.path.join(".");
        if (path === "text") errs.text = issue.message;
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
    input: EyesCommentSchemaInput,
    signal: AbortSignal
): Promise<EyesCommentBackendResult> => {
    await abortableDelay(1000, signal);

    const errors: EyesCommentErrors = {};
    const result = eyesCommentSchema.safeParse(input);
    if (result.success) return { success: true, data: { eyes_comment_id: "1" } };

    for (const issue of result.error.issues) {
        const path = issue.path.join(".");
        if (path === "text") errors.text = issue.message;
    }
    return { success: false, errors: errors };
};

// 処理フロー
const voicesFlow = async (input: EyesCommentSchemaInput, signal: AbortSignal): Promise<FlowResult> => {
    const front = validateFront(input);
    if (front) return front;
    const back = await dummyBackendProcess(input, signal);
    if (back.success) return { stage: "posted", data: back.data };
    return { stage: "backend_validation", errors: back.errors };
};


const EyesCommentForm: React.FC<EyesCommentFormProps> = ({ eyes, isCommentVisible, onToggle }) => {
    // 進行管理
    const [isSubmitting, setIsSubmitting] = useState(false);
    const controllerRef = useRef<AbortController | null>(null);
    useEffect(() => () => controllerRef.current?.abort(), []);

    // 入力
    const [inputText, setInputText] = useState("");

    // エラー表示
    const [textError, setTextError] = useState("");
    const [processingError, setProcessingError] = useState("");

    // エラー発生時のフォーカス用
    const textRef = useRef<HTMLTextAreaElement | null>(null);

    // A11y: 動的ID（aria-describedby用）
    const textErrId = useId();

    // リアルタイムバリデーション
    const handleInputTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputText(validateTextRealTime(e.target.value, MAX_EYES_COMMENT_LETTERS));
        setTextError("");
        setProcessingError("");
    };

    // エラー表示ユーティリティ
    const applyFieldErrors = (e: EyesCommentErrors) => {
        setTextError(e.text ?? "");
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

            const input: EyesCommentSchemaInput = {
                text: compactText ? compactText : undefined,
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
                    setInputText("");
                    setTextError("");
                    setProcessingError("");
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
            {(eyes !== undefined && eyes !== null) &&
                <form className={styles.eyes_comment_form_wrapper} onSubmit={handleSubmit} aria-busy={isSubmitting}>
                    <div className={styles.comment_pipe} />

                    {textError && (
                        <span id={textErrId} className={styles.text_error_message} role="alert" aria-live="assertive">{textError}</span>
                    )}

                    {processingError && (
                        <span className={styles.processing_error_message} role="alert" aria-live="assertive">{processingError}</span>
                    )}

                    <textarea
                        ref={textRef}
                        className={styles.text_placeholder}
                        placeholder="コメントを投稿"
                        maxLength={MAX_EYES_COMMENT_LETTERS}
                        value={inputText}
                        onChange={handleInputTextChange}
                        readOnly={isSubmitting}
                        aria-invalid={!!textError}
                        aria-describedby={textError ? textErrId : undefined}
                    />

                    <div className={styles.btn_container}>
                        {isCommentVisible ? (
                            <button
                                type="button"
                                className={styles.comment_isdisplay_btn}
                                onClick={onToggle}
                            >
                                Comment{" "}<FontAwesomeIcon icon={faChevronUp} />
                            </button>
                        ) : (
                            <button
                                type="button"
                                className={styles.comment_isdisplay_btn}
                                onClick={onToggle}
                            >
                                Comment{" "}<FontAwesomeIcon icon={faChevronDown} />
                            </button>
                        )}

                        <button type="submit" className={styles.comment_btn_outer} disabled={isSubmitting} aria-disabled={isSubmitting}>
                            <div className={styles.comment_btn_inner} />

                            <span>コメント</span>
                        </button>

                        <div className={styles.comment_btn_line} />
                    </div>
                </form>
            }
        </>
    )
};

export default EyesCommentForm;