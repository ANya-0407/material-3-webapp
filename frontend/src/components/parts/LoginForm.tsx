//LoginFormコンポーネントを作成

import styles from 'src/styles/LoginForm.module.css'
import React, { useRef, useState, useEffect, useId } from 'react'
import { useRouter } from "next/router";
import type { BackendResult } from "src/types";
import { validateAlphaNumericRealTime, validateAlphaNumeriSymbolicRealTime } from "src/utils/validators";
import { loginSchema, type LoginSchemaInput, MAX_EMAIL_LETTERS, MAX_PASSWORD_LETTERS } from "src/utils/schemas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAt, faUnlockKeyhole, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"


// バックエンドのレスポンスの型定義
type LoginData = { id: string };
type LoginErrors = {
    email?: string;
    password?: string;
    processing?: string;
}; //フロント側でも利用
type LoginBackendResult = BackendResult<LoginData, LoginErrors>;

// フローの各ステージ（本番は実際にログインを許可する処理のステージなども拡張）
type FlowResult =
    | { stage: "front_validation"; errors: LoginErrors }
    | { stage: "backend_validation"; errors: LoginErrors }
    | { stage: "authenticated"; data: LoginData };

// フロントエンドバリデーション関数
const validateFront = (input: LoginSchemaInput): FlowResult | null => {
    const result = loginSchema.safeParse(input);
    if (result.success) return null;

    const f = result.error.flatten().fieldErrors;
    return { stage: "front_validation", errors: { email: f.email?.[0], password: f.password?.[0] } };
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
    input: LoginSchemaInput,
    signal: AbortSignal
): Promise<LoginBackendResult> => {
    await abortableDelay(1000, signal); // 疑似API待機（中断可）

    const errors: LoginErrors = {};
    const result = loginSchema.safeParse(input);
    if (!result.success) {
        const f = result.error.flatten().fieldErrors;
        if (f.email?.[0]) errors.email = f.email[0];
        if (f.password?.[0]) errors.password = f.password[0];
    }
    const success = Object.values(errors).every(v => !v);

    return success
        ? { success: true, data: { id: "dummy" } }
        : { success: false, errors };
};

// 処理フロー
const loginFlow = async (
    input: LoginSchemaInput,
    signal: AbortSignal
): Promise<FlowResult> => {
    const frontResult = validateFront(input);
    if (frontResult) return frontResult;

    const backResult = await dummyBackendProcess(input, signal);
    if (backResult.success) {
        return { stage: "authenticated", data: backResult.data };
    };
    return { stage: "backend_validation", errors: backResult.errors };
};

const LoginForm: React.FC = () => {
    // ルーター
    const router = useRouter();

    // 進行管理
    const [isSubmitting, setIsSubmitting] = useState(false);
    const controllerRef = useRef<AbortController | null>(null);
    useEffect(() => () => controllerRef.current?.abort(), []);

    // 入力バリデーション・エラー表示用
    const [inputEmail, setInputEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [inputPassword, setInputPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [processingError, setProcessingError] = useState("");

    // エラー発生時のフォーカス用
    const emailInputRef = useRef<HTMLInputElement | null>(null)
    const passwordInputRef = useRef<HTMLInputElement | null>(null)

    // A11y: 動的ID（aria-describedby用）
    const emailErrId = useId()
    const passwordErrId = useId()

    // パスワードの可視・不可視切替
    const [showPassword, setShowPassword] = useState(false);
    const togglePassword = () => setShowPassword(!showPassword);

    // リアルタイムバリデーション
    const handleInputEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sanitized = validateAlphaNumeriSymbolicRealTime(e.target.value, MAX_EMAIL_LETTERS); 
        setInputEmail(sanitized);
        setEmailError("");
    };
    const handleInputPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sanitized = validateAlphaNumericRealTime(e.target.value, MAX_PASSWORD_LETTERS); 
        setInputPassword(sanitized);
        setPasswordError("");
    };

    // エラー表示ユーティリティ
    const applyFieldErrors = (e: LoginErrors) => {
        setEmailError(e.email ?? "");
        setPasswordError(e.password ?? "");
        setProcessingError(e.processing ?? "");

        // エラーが起きたinputにフォーカス
        if (e.email) { emailInputRef.current?.focus(); return; }
        if (e.password) { passwordInputRef.current?.focus(); return; }
    };

    // サブミット時の処理
    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (isSubmitting) return;

        // 古いリクエストを中止→新しいコントローラ
        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;

        try {
            setIsSubmitting(true);
            setEmailError("");
            setPasswordError("");
            setProcessingError("");

            const res = await loginFlow({ email: inputEmail, password: inputPassword }, controller.signal);
            if (controller.signal.aborted) return;

            switch (res.stage) {
                case "front_validation":
                    applyFieldErrors(res.errors);
                    return;
                case "backend_validation":
                    applyFieldErrors(res.errors);
                    return;
                case "authenticated":
                    setInputEmail("");
                    setInputPassword("");
                    router.push("/eyeshome");
                    return;
                default: {
                    const _exhaustive: never = res;
                    return _exhaustive;
                }
            }
        } catch (err: unknown) {
            // AbortError は意図された正しい挙動なので握りつぶす
            if (err instanceof DOMException && err.name === "AbortError") { return; };
            // ここに落ちてくるのはfetchでのエラー
            setProcessingError("Please retry");
        } finally {
            setIsSubmitting(false);
        }
    };

    //ルーティング
    const goSignup = () => router.push('/singup');

    return (
        <>
            <form className={styles.login_form_wrapper} onSubmit={handleSubmit} aria-busy={isSubmitting}>
                <div className={styles.tytle_container}>
                    <div className={styles.tytle_point}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                    <span>ログイン - アカウント情報</span>
                </div>

                <div className={styles.mailaddress_tytle_container}>
                    <label htmlFor="email" className={styles.mailaddress_tytle}>メールアドレス</label>

                    {emailError && (
                        <span id={emailErrId} role="alert" aria-live="assertive" className={styles.mailaddress_error_message}>{emailError}</span>
                    )}
                </div>

                <label htmlFor="email" className={styles.email_placeholder_container} >
                    <span><FontAwesomeIcon icon={faAt} /></span>

                    <input
                        id="email"
                        ref={emailInputRef}
                        placeholder="メールアドレス"
                        type="email"
                        aria-invalid={!!emailError}
                        aria-describedby={emailError ? emailErrId : undefined}
                        maxLength={MAX_EMAIL_LETTERS}
                        value={inputEmail}
                        onChange={handleInputEmailChange}
                        readOnly={isSubmitting} 
                        autoComplete="username"
                        inputMode="email"
                    />
                </label>

                <div className={styles.password_tytle_container}>
                    <label htmlFor="password" className={styles.password_tytle}>パスワード</label>

                    {passwordError && (
                        <span id={passwordErrId} role="alert" aria-live="assertive" className={styles.password_error_message}>{passwordError}</span>
                    )}
                </div>

                <label htmlFor="password" className={styles.password_placeholder_container}>
                    <span><FontAwesomeIcon icon={faUnlockKeyhole} /></span>

                    <input
                        id="password"
                        ref={passwordInputRef}
                        placeholder="8～50文字"
                        type={showPassword ? 'text' : 'password'}
                        aria-invalid={!!passwordError}
                        aria-describedby={passwordError ? passwordErrId : undefined}
                        maxLength={MAX_PASSWORD_LETTERS}
                        value={inputPassword}
                        onChange={handleInputPasswordChange}
                        readOnly={isSubmitting} 
                        autoComplete="current-password"
                    />

                    <button
                        type="button"
                        onClick={togglePassword}
                        className={styles.password_toggle_btn}
                        aria-label={showPassword ? 'パスワードを非表示' : 'パスワードを表示'}
                    >
                        <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                    </button>
                </label>

                <div className={styles.option_container}>
                    <label className={styles.option_checkbox}>
                        <input
                            type="checkbox"
                            disabled={isSubmitting}
                        />
                        <div className={styles.checkbox_inner}></div>

                        <span>サインイン状態を保つ</span>
                    </label>

                    <button type="button" onClick={() => router.push('/passwordforgot')}>パスワードを忘れた場合</button>
                </div>

                {processingError && (
                    <span role="alert" aria-live="assertive" className={styles.processing_error_message}>{processingError}</span>
                )}

                {isSubmitting ? (
                    <div className={styles.dummy_login_btn}>
                        <div className={styles.loader}></div>
                    </div>
                ): (
                    <button
                        className={styles.login_btn}
                        type="submit"
                        disabled={isSubmitting}
                        aria-disabled={isSubmitting}
                    >
                        <div></div>
                        <span>ログイン</span>
                    </button>
                )}

                <div className={styles.dividing_line} />

                <button type="button" className={styles.signup_btn} onClick={goSignup}>
                    <div></div>
                    <span>新規登録</span>
                </button>
            </form>
        </>
    )
};

export default LoginForm;