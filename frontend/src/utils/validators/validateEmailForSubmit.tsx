export type ValidationResult = {
    isValid: boolean;
    sanitized: string;
    error?: string;
};

/**
 * メールアドレスバリデーション（送信前用）
 *
 * @param input - 入力文字列
 * @param minLength - 最小文字数（省略時は 0）
 * @param maxLength - 最大文字数（省略時は無制限）
 * 
 * @returns - 適切な形式であったかどうか、サニタイズ済みの文字列、エラーの種類
 */
export const validateEmailForSubmit = ( input: string, minLength: number = 0, maxLength?: number ): ValidationResult => {
    // 最大長制限（任意）
    const trimmed = typeof maxLength === "number" ? input.slice(0, maxLength) : input;

    // 最小長チェック
    if (trimmed.length < minLength) {
        return {
            isValid: false,
            sanitized: "",
            error: `文字数が足りません`,
        };
    }

    //メールアドレスの形式か
    if (!/^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmed)) {
        return {
            isValid: false,
            sanitized: "",
            error: "正しい形式で入力してください",
        };
    }

    return {
        isValid: true,
        sanitized: trimmed,
    };
};